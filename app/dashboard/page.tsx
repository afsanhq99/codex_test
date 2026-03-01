import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CancelBookingButton } from '@/components/cancel-booking-button';
import { getMyBookings, getAllBookings } from '@/lib/queries/bookings';
import { getCurrentUserProfile } from '@/lib/queries/profile';

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  const [myBookings, allBookings] = await Promise.all([
    getMyBookings(),
    profile.role === 'admin' ? getAllBookings() : Promise.resolve([]),
  ]);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600">Welcome back, {profile.full_name ?? 'Guest'}.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Bookings</h2>
          {profile.role === 'admin' && (
            <Link href="/admin/events" className="btn-primary">
              Manage Events
            </Link>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {myBookings.map((booking) => (
            <article key={booking.id} className="card space-y-2">
              <h3 className="font-semibold">{booking.events?.title}</h3>
              <p className="text-sm text-slate-600">Status: {booking.booking_status}</p>
              <p className="text-sm">Tickets: {booking.quantity}</p>
              <p className="text-sm">Total paid: ${Number(booking.total_price).toFixed(2)}</p>
              {booking.booking_status === 'confirmed' && <CancelBookingButton bookingId={booking.id} />}
            </article>
          ))}
          {myBookings.length === 0 && (
            <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-700">No bookings found yet.</p>
          )}
        </div>
      </div>

      {profile.role === 'admin' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Bookings (Admin)</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Event</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {allBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-slate-200">
                    <td className="px-4 py-2">{booking.profiles?.full_name ?? booking.user_id}</td>
                    <td className="px-4 py-2">{booking.events?.title}</td>
                    <td className="px-4 py-2">{booking.quantity}</td>
                    <td className="px-4 py-2">{booking.booking_status}</td>
                    <td className="px-4 py-2">{new Date(booking.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
