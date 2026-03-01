import { notFound } from 'next/navigation';
import { BookingForm } from '@/components/booking-form';
import { LiveSeatCounter } from '@/components/live-seat-counter';
import { getEventById } from '@/lib/queries/events';
import { getCurrentUserProfile } from '@/lib/queries/profile';

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, profile] = await Promise.all([getEventById(params.id), getCurrentUserProfile()]);

  if (!event) return notFound();

  return (
    <section className="space-y-6">
      <div className="card space-y-3">
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-slate-700">{event.description}</p>
        <p>
          <span className="font-medium">Location:</span> {event.location}
        </p>
        <p>
          <span className="font-medium">Event Date:</span>{' '}
          {new Date(event.event_date).toLocaleString(undefined, {
            dateStyle: 'full',
            timeStyle: 'short',
          })}
        </p>
        <p>
          <span className="font-medium">Price per ticket:</span> ${Number(event.price).toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Seats:</span> {event.available_seats}/{event.total_seats}
        </p>
        <LiveSeatCounter eventId={event.id} initialAvailable={event.available_seats} />
      </div>

      {!profile && (
        <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
          Please sign in to book this event.
        </p>
      )}

      {profile && event.available_seats > 0 && <BookingForm eventId={event.id} maxSeats={event.available_seats} />}

      {profile && event.available_seats === 0 && (
        <div className="rounded-lg bg-rose-50 p-4 text-rose-700">This event is sold out.</div>
      )}
    </section>
  );
}
