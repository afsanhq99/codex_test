'use client';

import { useFormState, useFormStatus } from 'react-dom';

type ActionState = { error?: string; success?: string };

type Props = {
  title: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState | void>;
  includeName?: boolean;
  submitLabel: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? 'Please wait...' : label}
    </button>
  );
}

export function AuthForm({ title, action, includeName = false, submitLabel }: Props) {
  const [state, formAction] = useFormState(action, {});

  return (
    <div className="mx-auto w-full max-w-md card">
      <h1 className="mb-6 text-2xl font-semibold">{title}</h1>
      <form action={formAction} className="space-y-4">
        {includeName && (
          <label className="block space-y-1">
            <span className="text-sm font-medium">Full name</span>
            <input className="input" name="full_name" type="text" required />
          </label>
        )}
        <label className="block space-y-1">
          <span className="text-sm font-medium">Email</span>
          <input className="input" name="email" type="email" required />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Password</span>
          <input className="input" name="password" type="password" minLength={6} required />
        </label>
        {state.error && <p className="text-sm text-rose-600">{state.error}</p>}
        {state.success && <p className="text-sm text-emerald-600">{state.success}</p>}
        <SubmitButton label={submitLabel} />
      </form>
    </div>
  );
}
