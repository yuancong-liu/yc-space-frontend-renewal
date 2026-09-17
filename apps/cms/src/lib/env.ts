export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

/**
 * Supabase credentials, or `null` when the app has not been configured yet.
 *
 * Read lazily (never at module scope) so `next build` and CI keep working
 * without secrets — only a real request needs the values.
 */
export const getSupabaseEnv = (): SupabaseEnv | null => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return { url, anonKey };
};

export const requireSupabaseEnv = (): SupabaseEnv => {
  const env = getSupabaseEnv();

  if (!env) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).'
    );
  }

  return env;
};

/**
 * Public origin of the CMS, used to build e-mail redirect links. Falls back to
 * the Vercel-provided URL, then to the local dev server.
 */
export const getCmsOrigin = (): string => {
  const explicit = process.env.NEXT_PUBLIC_CMS_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return 'http://localhost:3001';
};
