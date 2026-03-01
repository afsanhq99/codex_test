import { createServerClient } from '@/lib/supabase/server';

export async function getMyBookings() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from('bookings')
    .select('*, events(id,title,event_date,location,price)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getAllBookings() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('bookings')
    .select('*, events(id,title,event_date), profiles(id,full_name)')
    .order('created_at', { ascending: false });

  return data ?? [];
}
