import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { login } from '@/lib/actions/auth';

const loginWithState = async (_: { error?: string; success?: string }, formData: FormData) => {
  'use server';
  return login(formData);
};

export default function LoginPage() {
  return (
    <section className="space-y-4">
      <AuthForm title="Welcome back" action={loginWithState} submitLabel="Sign in" />
      <p className="text-center text-sm text-slate-600">
        No account?{' '}
        <Link className="font-medium text-brand" href="/auth/signup">
          Create one
        </Link>
      </p>
    </section>
  );
}
