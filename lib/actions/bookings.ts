'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';

type ActionState = { error?: string; success?: string };

export async function createBookingAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerClient();
  const eventId = String(formData.get('event_id') ?? '');
  const quantity = Number(formData.get('quantity') ?? 1);

  if (!eventId || Number.isNaN(quantity) || quantity <= 0) {
    return { error: 'Invalid booking request.' };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to book tickets.' };
  }

  const { error } = await supabase.rpc('create_booking', {
    p_user_id: user.id,
    p_event_id: eventId,
    p_quantity: quantity,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath(`/events/${eventId}`);
  revalidatePath('/dashboard');

  return { success: 'Booking confirmed!' };
}

export async function cancelBookingAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerClient();
  const bookingId = String(formData.get('booking_id') ?? '');

  if (!bookingId) {
    return { error: 'Booking id is required.' };
  }

  const { error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/');
  return { success: 'Booking cancelled and seats restored.' };
}
