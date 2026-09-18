import { afterEach, describe, expect, it, vi } from 'vitest';

import { getRevalidateOrigins, revalidateSite } from './revalidate';

const set = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

afterEach(() => {
  set('SITE_REVALIDATE_ORIGINS', undefined);
  set('REVALIDATE_SECRET', undefined);
  vi.unstubAllGlobals();
});

describe('getRevalidateOrigins()', () => {
  it('splits, trims and drops a trailing slash', () => {
    set('SITE_REVALIDATE_ORIGINS', ' https://a.example/ , https://b.example ');

    expect(getRevalidateOrigins()).toEqual([
      'https://a.example',
      'https://b.example',
    ]);
  });

  it('is empty when unset', () => {
    expect(getRevalidateOrigins()).toEqual([]);
  });
});

describe('revalidateSite()', () => {
  const change = { slug: 'hello' };

  it('does nothing when no origins are configured', async () => {
    set('REVALIDATE_SECRET', 'shh');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    expect(await revalidateSite(change)).toEqual({ attempted: 0, failed: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('does nothing without a secret, rather than asking unauthenticated', async () => {
    set('SITE_REVALIDATE_ORIGINS', 'https://a.example');
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    expect(await revalidateSite(change)).toEqual({ attempted: 0, failed: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('posts the change to every origin with the secret', async () => {
    set('SITE_REVALIDATE_ORIGINS', 'https://a.example,https://b.example');
    set('REVALIDATE_SECRET', 'shh');
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchSpy);

    const outcome = await revalidateSite({ slug: 'new', previousSlug: 'old' });

    expect(outcome).toEqual({ attempted: 2, failed: [] });
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('https://a.example/api/revalidate');
    expect(init.headers['x-revalidate-secret']).toBe('shh');
    expect(JSON.parse(init.body)).toEqual({
      slug: 'new',
      previousSlug: 'old',
    });
  });

  it('reports the origins that refused', async () => {
    set('SITE_REVALIDATE_ORIGINS', 'https://ok.example,https://bad.example');
    set('REVALIDATE_SECRET', 'shh');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({ ok: !url.includes('bad') }))
    );

    expect(await revalidateSite(change)).toEqual({
      attempted: 2,
      failed: ['https://bad.example'],
    });
  });

  it('survives an origin that throws', async () => {
    set('SITE_REVALIDATE_ORIGINS', 'https://down.example');
    set('REVALIDATE_SECRET', 'shh');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('ECONNREFUSED');
      })
    );

    // A save must not fail because the site is unreachable.
    expect(await revalidateSite(change)).toEqual({
      attempted: 1,
      failed: ['https://down.example'],
    });
  });
});
