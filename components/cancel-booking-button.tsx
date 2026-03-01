'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { cancelBookingAction } from '@/lib/actions/bookings';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-secondary" disabled={pending}>
      {pending ? 'Cancelling...' : 'Cancel booking'}
    </button>
  );
}

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [state, action] = useFormState(cancelBookingAction, {});

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="booking_id" value={bookingId} />
      {state.error && <p className="text-xs text-rose-600">{state.error}</p>}
      {state.success && <p className="text-xs text-emerald-600">{state.success}</p>}
      <Submit />
    </form>
  );
}
