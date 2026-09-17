import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { isAllowedEmail } from '@/lib/auth/allowlist';
import { getSupabaseEnv } from '@/lib/env';

const PUBLIC_PATHS = ['/login', '/auth'];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );

const redirectTo = (request: NextRequest, pathname: string, params = {}) => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return NextResponse.redirect(url);
};

/**
 * Refreshes the Supabase session cookie and gates every non-public route.
 *
 * Runs from the Next proxy (formerly middleware). A cookie is the only thing it
 * can be sure about, so it re-validates the user with `getUser()` on each
 * request rather than trusting a decoded token.
 */
export const updateSession = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const env = getSupabaseEnv();

  // Not configured yet: let /login render its setup notice, block the rest.
  if (!env) {
    return isPublicPath(pathname)
      ? NextResponse.next({ request })
      : redirectTo(request, '/login');
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: cookiesToSet => {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Do not put any logic between createServerClient and getUser(): a stray
  // await here is the classic cause of randomly logged-out users.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && !isAllowedEmail(user.email)) {
    await supabase.auth.signOut();

    // signOut() writes the cleared auth cookies onto supabaseResponse; carry
    // them over to the redirect or the browser keeps the stale session.
    const response = redirectTo(request, '/login', { error: 'not_allowed' });
    supabaseResponse.cookies
      .getAll()
      .forEach(cookie => response.cookies.set(cookie));

    return response;
  }

  if (!user && !isPublicPath(pathname)) {
    return redirectTo(request, '/login', { next: pathname });
  }

  if (user && pathname === '/login') {
    return redirectTo(request, '/');
  }

  return supabaseResponse;
};
