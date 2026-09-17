import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { isAllowedEmail } from '@/lib/auth/allowlist';
import { createClient } from '@/lib/supabase/server';

/**
 * Lands the sign-in e-mail. Supports both shapes Supabase can send:
 *
 * - `?token_hash=…&type=…` — the recommended server-side template, set in
 *   Supabase → Authentication → Email Templates (see README).
 * - `?code=…` — the PKCE code exchange, used by OAuth providers.
 *
 * Only `/`-relative `next` values are honoured, so a crafted link cannot bounce
 * the freshly signed-in session to another origin.
 */
const safeNext = (value: string | null) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/';

const failure = (origin: string, reason: string) =>
  NextResponse.redirect(`${origin}/login?error=${reason}`);

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const next = safeNext(searchParams.get('next'));

  const supabase = await createClient();

  const result = (() => {
    if (tokenHash && type) {
      return supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    }
    if (code) return supabase.auth.exchangeCodeForSession(code);

    return null;
  })();

  if (!result) return failure(origin, 'invalid_link');

  const { data, error } = await result;

  if (error) return failure(origin, 'link_expired');

  if (!isAllowedEmail(data.user?.email)) {
    await supabase.auth.signOut();

    return failure(origin, 'not_allowed');
  }

  return NextResponse.redirect(`${origin}${next}`);
};
