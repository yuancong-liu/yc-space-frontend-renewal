import { ThemeRadio } from '@yc/ui';

import { getSupabaseEnv } from '@/lib/env';

import { LoginForm } from './login-form';

const ERROR_MESSAGES: Record<string, string> = {
  not_allowed: 'That account is not allowed to use this CMS.',
  link_expired: 'That sign-in link has expired. Request a new one.',
  invalid_link: 'That sign-in link is malformed. Request a new one.',
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { error, next } = await searchParams;
  const isConfigured = Boolean(getSupabaseEnv());
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className='cms-centered'>
      <div className='cms-card flex w-full max-w-sm flex-col gap-6'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h1 className='text-xl font-semibold text-text'>YC Space CMS</h1>
            <p className='text-sm text-text/70'>Sign in to manage content.</p>
          </div>
          <ThemeRadio />
        </div>

        {errorMessage && (
          <p className='text-sm text-accent-2' role='alert'>
            {errorMessage}
          </p>
        )}

        {isConfigured ? (
          <LoginForm next={next ?? '/'} />
        ) : (
          <p className='text-sm text-accent-2' role='alert'>
            Supabase is not configured. Copy <code>.env.example</code> to{' '}
            <code>.env.local</code> and fill in the project URL and anon key.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
