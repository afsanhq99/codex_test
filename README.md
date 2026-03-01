# TicketHub — Full-Stack Ticket Booking Website

A production-ready starter for ticket booking built with **Next.js App Router + TypeScript + Supabase (Auth, PostgreSQL, RLS, Realtime)**.

## 1) Project Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your Supabase values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2) Supabase SQL Setup

Run SQL files in Supabase SQL editor in this order:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

This creates tables, indexes, triggers, transactional booking RPCs, RLS policies, and realtime publication.

## 3) Architecture (Step-by-Step)

1. **Auth** (`/auth/login`, `/auth/signup`) uses Supabase email/password.
2. **Profile provisioning** is automatic via `handle_new_user` trigger.
3. **Public event browsing** is server-rendered in `app/page.tsx`.
4. **Event details** page uses server data fetching and client realtime subscription.
5. **Booking flow** uses a server action that calls transactional SQL RPC `create_booking`.
6. **Cancellation flow** uses RPC `cancel_booking` to restore seats.
7. **Role-based dashboard** shows user bookings and admin controls.
8. **Admin panel** can create/update/delete events (guarded by RLS + app checks).

## 4) Folder Structure

```txt
app/
  auth/
    login/
    signup/
  events/[id]/
  dashboard/
  admin/events/
  layout.tsx
  page.tsx
components/
lib/
  actions/
  queries/
  supabase/
types/
supabase/
  schema.sql
  seed.sql
```

## 5) Realtime Seat Availability

`components/live-seat-counter.tsx` subscribes to updates on the `events` row, displaying live seat counts when bookings/cancellations happen.

## 6) Transaction + Overbooking Protection

`create_booking` in SQL does:

- `SELECT ... FOR UPDATE` on event row.
- Validates requested quantity against `available_seats`.
- Atomically decrements seats and inserts booking.

This prevents race-condition overbooking under concurrent requests.

## 7) Security and RLS

- Users can only read/update their own profile.
- Everyone can read events.
- Only admins can manage events.
- Users can only view their own bookings (admins can view all bookings).
- RPC execution is granted only to authenticated users.

## 8) Loading/Error UX

- Route-level loading skeleton in `app/loading.tsx`.
- Form-level pending states via `useFormStatus`.
- Action-level error/success rendering in each form.

## 9) Production Notes

- Add email confirmation flow and password reset.
- Add webhook/logging for failed payment intent (if integrating Stripe).
- Add pagination for large event/booking datasets.
- Add stronger input validation with Zod in server actions.
