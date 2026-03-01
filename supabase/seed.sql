insert into public.events (
  title,
  description,
  location,
  event_date,
  total_seats,
  available_seats,
  price,
  created_by
)
values
  (
    'Next.js Summit 2026',
    'A full-day event focused on modern React and Next.js architecture.',
    'San Francisco Convention Center',
    now() + interval '10 days',
    200,
    200,
    149.00,
    (select id from public.profiles where role = 'admin' limit 1)
  ),
  (
    'Realtime Systems Workshop',
    'Hands-on workshop building scalable realtime apps with Postgres and websockets.',
    'Online',
    now() + interval '15 days',
    120,
    120,
    79.00,
    (select id from public.profiles where role = 'admin' limit 1)
  ),
  (
    'Product Design + Engineering Meetup',
    'Panel discussion with product designers and engineering leaders.',
    'Austin Tech Hub',
    now() + interval '20 days',
    80,
    80,
    39.00,
    (select id from public.profiles where role = 'admin' limit 1)
  )
on conflict do nothing;
