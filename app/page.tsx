import { EventGrid } from '@/components/event-grid';
import { getUpcomingEvents } from '@/lib/queries/events';

export default async function HomePage() {
  const events = await getUpcomingEvents();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upcoming Events</h1>
        <p className="mt-2 text-slate-600">
          Discover and book seats for curated events in real-time.
        </p>
      </div>
      <EventGrid events={events} />
    </section>
  );
}
