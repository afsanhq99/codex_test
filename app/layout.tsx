import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { getCurrentUserProfile } from '@/lib/queries/profile';
import { logout } from '@/lib/actions/auth';

export const metadata: Metadata = {
  title: 'Ticket Booking Platform',
  description: 'Book event seats in real-time with Supabase and Next.js',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await getCurrentUserProfile();

  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="container-shell flex items-center justify-between py-4">
            <Link href="/" className="text-lg font-semibold text-brand">
              TicketHub
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <Link href="/" className="hover:text-brand">
                Events
              </Link>
              {profile ? (
                <>
                  <Link href="/dashboard" className="hover:text-brand">
                    Dashboard
                  </Link>
                  <form action={logout}>
                    <button type="submit" className="btn-secondary">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="btn-primary">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="container-shell">{children}</main>
      </body>
    </html>
  );
}
