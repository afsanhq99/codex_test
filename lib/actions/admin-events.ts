'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { getCurrentUserProfile } from '@/lib/queries/profile';

type ActionState = { error?: string; success?: string };

async function assertAdmin() {
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return profile;
}

export async function createEventAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await assertAdmin();
  const supabase = createServerClient();

  const payload = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    location: String(formData.get('location') ?? ''),
    event_date: String(formData.get('event_date') ?? ''),
    total_seats: Number(formData.get('total_seats') ?? 0),
    available_seats: Number(formData.get('total_seats') ?? 0),
    price: Number(formData.get('price') ?? 0),
    created_by: profile.id,
  };

  const { error } = await supabase.from('events').insert(payload);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/dashboard');
  return { success: 'Event created.' };
}

export async function updateEventAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await assertAdmin();
  const supabase = createServerClient();

  const eventId = String(formData.get('event_id') ?? '');
  const payload = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    location: String(formData.get('location') ?? ''),
    event_date: String(formData.get('event_date') ?? ''),
    total_seats: Number(formData.get('total_seats') ?? 0),
    price: Number(formData.get('price') ?? 0),
  };

  const { error } = await supabase.from('events').update(payload).eq('id', eventId);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/dashboard');
  return { success: 'Event updated.' };
}

export async function deleteEventAction(_: ActionState, formData: FormData): Promise<ActionState> {
  await assertAdmin();
  const supabase = createServerClient();
  const eventId = String(formData.get('event_id') ?? '');

  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/dashboard');
  return { success: 'Event deleted.' };
}
