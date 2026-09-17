'use server';

import { isAllowedEmail } from '@/lib/auth/allowlist';
import { getCmsOrigin, getSupabaseEnv } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export type SignInState = {
  status: 'idle' | 'sent' | 'error';
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same answer whether or not the address is on the allowlist, so the login page
// cannot be used to enumerate who may sign in.
const NEUTRAL_SENT: SignInState = {
  status: 'sent',
  message: 'If that address can sign in, a link is on its way. Check your inbox.',
};

export const requestSignInLink = async (
  _previousState: SignInState,
  formData: FormData
): Promise<SignInState> => {
  if (!getSupabaseEnv()) {
    return {
      status: 'error',
      message: 'Supabase is not configured yet. See .env.example.',
    };
  }

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const next = String(formData.get('next') ?? '/');

  if (!EMAIL_PATTERN.test(email)) {
    return { status: 'error', message: 'Enter a valid e-mail address.' };
  }

  if (!isAllowedEmail(email)) return NEUTRAL_SENT;

  const supabase = await createClient();
  const redirectTo = `${getCmsOrigin()}/auth/confirm?next=${encodeURIComponent(next)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) {
    return {
      status: 'error',
      message: 'Could not send the sign-in link. Try again in a moment.',
    };
  }

  return NEUTRAL_SENT;
};
