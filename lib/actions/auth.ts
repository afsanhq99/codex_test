'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export async function signup(formData: FormData) {
  const supabase = createServerClient();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const fullName = String(formData.get('full_name') ?? '');

  if (!email || !password || !fullName) {
    return { error: 'All fields are required.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: 'Unable to create account.' };
  }

  return { success: 'Account created. Verify email if required, then log in.' };
}

export async function login(formData: FormData) {
  const supabase = createServerClient();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function logout() {
  const supabase = createServerClient();
  await supabase.auth.signOut();
  redirect('/');
}
