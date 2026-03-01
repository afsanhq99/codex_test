'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createEventAction, updateEventAction, deleteEventAction } from '@/lib/actions/admin-events';
import type { Event } from '@/types/database';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? 'Saving...' : label}
    </button>
  );
}

export function CreateEventForm() {
  const [state, action] = useFormState(createEventAction, {});

  return (
    <form action={action} className="card grid gap-3 md:grid-cols-2">
      <h2 className="md:col-span-2 text-lg font-semibold">Create New Event</h2>
      <input className="input" name="title" placeholder="Title" required />
      <input className="input" name="location" placeholder="Location" required />
      <textarea className="input md:col-span-2" name="description" placeholder="Description" required />
      <input className="input" type="datetime-local" name="event_date" required />
      <input className="input" type="number" name="total_seats" placeholder="Total Seats" min={1} required />
      <input className="input" type="number" step="0.01" name="price" placeholder="Price" min={0} required />
      {state.error && <p className="text-sm text-rose-600 md:col-span-2">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600 md:col-span-2">{state.success}</p>}
      <SubmitButton label="Create Event" />
    </form>
  );
}

export function AdminEventRow({ event }: { event: Event }) {
  const [updateState, updateAction] = useFormState(updateEventAction, {});
  const [deleteState, deleteAction] = useFormState(deleteEventAction, {});

  return (
    <article className="card space-y-3">
      <form action={updateAction} className="grid gap-2 md:grid-cols-2">
        <input type="hidden" name="event_id" value={event.id} />
        <input className="input" name="title" defaultValue={event.title} required />
        <input className="input" name="location" defaultValue={event.location} required />
        <textarea className="input md:col-span-2" name="description" defaultValue={event.description ?? ''} required />
        <input
          className="input"
          type="datetime-local"
          name="event_date"
          defaultValue={new Date(event.event_date).toISOString().slice(0, 16)}
          required
        />
        <input className="input" type="number" name="total_seats" defaultValue={event.total_seats} min={1} required />
        <input className="input" type="number" name="price" step="0.01" defaultValue={event.price} min={0} required />
        <SubmitButton label="Update" />
      </form>
      {updateState.error && <p className="text-sm text-rose-600">{updateState.error}</p>}
      {updateState.success && <p className="text-sm text-emerald-600">{updateState.success}</p>}

      <form action={deleteAction}>
        <input type="hidden" name="event_id" value={event.id} />
        {deleteState.error && <p className="text-sm text-rose-600">{deleteState.error}</p>}
        {deleteState.success && <p className="text-sm text-emerald-600">{deleteState.success}</p>}
        <button type="submit" className="btn-secondary bg-rose-100 text-rose-700 hover:bg-rose-200">
          Delete Event
        </button>
      </form>
    </article>
  );
}
