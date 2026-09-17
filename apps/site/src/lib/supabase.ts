import { createClient } from '@supabase/supabase-js';

/**
 * Read-only client for the public site. No cookies and no session: every row it
 * can reach is already decided by the `posts_public_read` policy, so the anon
 * key is the whole of its authority.
 *
 * Returns null when the project is not configured, which is what lets `next
 * build` and CI run without secrets — callers fall back to an empty archive
 * rather than failing the build.
 */
export const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
