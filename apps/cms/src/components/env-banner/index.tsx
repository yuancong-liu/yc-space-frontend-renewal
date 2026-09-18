import { getSupabaseEnv } from '@/lib/env';

const supabaseHost = () => {
  const env = getSupabaseEnv();
  if (!env) return 'not configured';

  try {
    return new URL(env.url).host;
  } catch {
    return 'invalid URL';
  }
};

/**
 * There is no separate development Supabase project, so local and preview
 * deployments talk to the live database. Say so loudly rather than relying on
 * the developer remembering.
 */
export const EnvBanner = () => {
  const environment = process.env.VERCEL_ENV ?? 'development';

  if (environment === 'production') return null;

  return (
    <div className='cms-env-banner' role='status'>
      <strong>{environment}</strong>
      <span>
        connected to <code>{supabaseHost()}</code> — this is the live database
      </span>
    </div>
  );
};
