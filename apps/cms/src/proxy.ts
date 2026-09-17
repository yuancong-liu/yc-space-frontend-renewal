import type { NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/proxy';

export const proxy = async (request: NextRequest) => updateSession(request);

export const config = {
  matcher: [
    /*
     * Everything except Next internals and static assets — auth has to be the
     * default, with public paths opted in explicitly inside updateSession().
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
