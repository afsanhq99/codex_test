import { EventCard } from '@/components/event-card';
import type { Event } from '@/types/database';

export function EventGrid({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p className="rounded-lg bg-amber-50 p-4 text-amber-800">No upcoming events available.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
