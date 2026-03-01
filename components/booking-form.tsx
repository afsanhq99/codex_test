'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createBookingAction } from '@/lib/actions/bookings';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? 'Booking...' : 'Confirm booking'}
    </button>
  );
}

export function BookingForm({ eventId, maxSeats }: { eventId: string; maxSeats: number }) {
  const [state, action] = useFormState(createBookingAction, {});

  return (
    <form action={action} className="card mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Book your seats</h2>
      <input type="hidden" name="event_id" value={eventId} />
      <label className="block space-y-1">
        <span className="text-sm font-medium">Ticket quantity</span>
        <input className="input" type="number" name="quantity" min={1} max={maxSeats} defaultValue={1} required />
      </label>
      <p className="text-xs text-slate-500">Maximum allowed by current inventory: {maxSeats}</p>
      {state.error && <p className="text-sm text-rose-600">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600">{state.success}</p>}
      <Submit />
    </form>
  );
}
