import { redirect } from 'next/navigation';
import { AdminEventRow, CreateEventForm } from '@/components/admin-event-form';
import { getUpcomingEvents } from '@/lib/queries/events';
import { getCurrentUserProfile } from '@/lib/queries/profile';

export default async function AdminEventsPage() {
  const [profile, events] = await Promise.all([getCurrentUserProfile(), getUpcomingEvents()]);

  if (!profile) redirect('/auth/login');
  if (profile.role !== 'admin') redirect('/dashboard');

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Event Management</h1>
      <CreateEventForm />
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Update Existing Events</h2>
        {events.map((event) => (
          <AdminEventRow key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
