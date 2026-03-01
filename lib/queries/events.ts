import { createServerClient } from '@/lib/supabase/server';
import type { Event } from '@/types/database';

export async function getUpcomingEvents(): Promise<Event[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();

  if (error) return null;

  return data;
}
