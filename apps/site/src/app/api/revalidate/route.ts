import { createHash, timingSafeEqual } from 'crypto';

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { getRevalidateSecret } from '@/lib/env';
import { revalidateTargets } from '@/lib/revalidate-paths';
import type { RevalidateRequest } from '@/lib/revalidate-paths';

/**
 * Lets the CMS refresh this deployment the moment a post changes, instead of
 * waiting out the page-level revalidate window.
 *
 * Each deployment holds its own secret, so the production CMS refreshing
 * production and staging is a matter of which origins it is pointed at — this
 * endpoint only ever speaks for the deployment it is part of.
 */
const SECRET_HEADER = 'x-revalidate-secret';

/** Hash first: comparing raw values would leak the secret's length. */
const matches = (presented: string, expected: string) =>
  timingSafeEqual(
    createHash('sha256').update(presented).digest(),
    createHash('sha256').update(expected).digest()
  );

export const POST = async (request: Request) => {
  const secret = getRevalidateSecret();

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, reason: 'not configured' },
      { status: 503 }
    );
  }

  const presented = request.headers.get(SECRET_HEADER);

  if (!presented || !matches(presented, secret)) {
    return NextResponse.json(
      { revalidated: false, reason: 'unauthorised' },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as RevalidateRequest;
  const targets = revalidateTargets(body);

  for (const { path, type } of targets) revalidatePath(path, type);

  return NextResponse.json({
    revalidated: true,
    paths: targets.map(target => target.path),
  });
};
