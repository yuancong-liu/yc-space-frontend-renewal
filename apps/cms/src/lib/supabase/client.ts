import { createBrowserClient } from '@supabase/ssr';

import { requireSupabaseEnv } from '@/lib/env';

/** Supabase client for Client Components. */
export const createClient = () => {
  const { url, anonKey } = requireSupabaseEnv();

  return createBrowserClient(url, anonKey);
};
