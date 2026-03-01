import Link from 'next/link';
import type { Event } from '@/types/database';

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="card flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{event.title}</h2>
      <p className="line-clamp-2 text-sm text-slate-600">{event.description ?? 'No description provided.'}</p>
      <div className="space-y-1 text-sm">
        <p>
          <span className="font-medium">Location:</span> {event.location}
        </p>
        <p>
          <span className="font-medium">Date:</span>{' '}
          {new Date(event.event_date).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </p>
        <p>
          <span className="font-medium">Available seats:</span> {event.available_seats}/{event.total_seats}
        </p>
        <p>
          <span className="font-medium">Price:</span> ${Number(event.price).toFixed(2)}
        </p>
      </div>
      <Link href={`/events/${event.id}`} className="btn-primary mt-1">
        View details
      </Link>
    </article>
  );
}
