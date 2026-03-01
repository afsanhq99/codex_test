import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { signup } from '@/lib/actions/auth';

const signupWithState = async (_: { error?: string; success?: string }, formData: FormData) => {
  'use server';
  return signup(formData);
};

export default function SignupPage() {
  return (
    <section className="space-y-4">
      <AuthForm title="Create account" action={signupWithState} includeName submitLabel="Sign up" />
      <p className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link className="font-medium text-brand" href="/auth/login">
          Sign in
        </Link>
      </p>
    </section>
  );
}
