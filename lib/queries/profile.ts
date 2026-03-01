import { cache } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export const getCurrentUserProfile = cache(async (): Promise<Profile | null> => {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return data;
});
