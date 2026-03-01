-- Extensions
create extension if not exists "pgcrypto";

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text not null,
  event_date timestamptz not null,
  total_seats integer not null check (total_seats > 0),
  available_seats integer not null check (available_seats >= 0),
  price numeric(10,2) not null check (price >= 0),
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  constraint available_not_more_than_total check (available_seats <= total_seats)
);

-- Bookings table
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  booking_status text not null default 'confirmed' check (booking_status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_events_event_date on public.events(event_date);
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_event_id on public.bookings(event_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Booking function with transaction-safe seat locking
create or replace function public.create_booking(
  p_user_id uuid,
  p_event_id uuid,
  p_quantity integer
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events;
  v_booking public.bookings;
begin
  if p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  select * into v_event
  from public.events
  where id = p_event_id
  for update;

  if not found then
    raise exception 'Event not found';
  end if;

  if v_event.available_seats < p_quantity then
    raise exception 'Not enough seats available';
  end if;

  update public.events
  set available_seats = available_seats - p_quantity
  where id = p_event_id;

  insert into public.bookings (user_id, event_id, quantity, total_price, booking_status)
  values (p_user_id, p_event_id, p_quantity, (v_event.price * p_quantity), 'confirmed')
  returning * into v_booking;

  return v_booking;
end;
$$;

-- Cancellation function restoring seats
create or replace function public.cancel_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
begin
  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if v_booking.booking_status = 'cancelled' then
    return v_booking;
  end if;

  update public.bookings
  set booking_status = 'cancelled'
  where id = p_booking_id
  returning * into v_booking;

  update public.events
  set available_seats = available_seats + v_booking.quantity
  where id = v_booking.event_id;

  return v_booking;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.bookings enable row level security;

-- Profiles policies
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Events policies
create policy "Anyone can view events"
on public.events
for select
using (true);

create policy "Admins can insert events"
on public.events
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admins can update events"
on public.events
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Admins can delete events"
on public.events
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Booking policies
create policy "Users can read own bookings"
on public.bookings
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

create policy "Users can create own bookings"
on public.bookings
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own bookings"
on public.bookings
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Grant execute on RPC functions
revoke all on function public.create_booking(uuid, uuid, integer) from public;
grant execute on function public.create_booking(uuid, uuid, integer) to authenticated;

revoke all on function public.cancel_booking(uuid) from public;
grant execute on function public.cancel_booking(uuid) to authenticated;

-- Realtime setup for events table
alter publication supabase_realtime add table public.events;
