import { afterEach, describe, expect, it } from 'vitest';

import { getSiteEnvironment, getSiteUrl, isProductionSite } from './env';

const set = (key: string, value: string | undefined) => {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
};

afterEach(() => {
  set('SITE_ENV', undefined);
  set('SITE_URL', undefined);
  set('VERCEL', undefined);
  set('VERCEL_ENV', undefined);
  set('VERCEL_URL', undefined);
});

describe('getSiteEnvironment()', () => {
  it.each(['production', 'staging', 'development'] as const)(
    'honours a declared %s',
    declared => {
      set('SITE_ENV', declared);

      expect(getSiteEnvironment()).toBe(declared);
    }
  );

  it('is production on an undeclared Vercel production deployment', () => {
    // One project serves the site, so VERCEL_ENV says this correctly and the
    // production deployment needs no variable to be indexed.
    set('VERCEL', '1');
    set('VERCEL_ENV', 'production');

    expect(getSiteEnvironment()).toBe('production');
    expect(isProductionSite()).toBe(true);
  });

  it('treats any other Vercel build as staging', () => {
    set('VERCEL', '1');
    set('VERCEL_ENV', 'preview');

    expect(getSiteEnvironment()).toBe('staging');
    expect(isProductionSite()).toBe(false);
  });

  it('lets a declared staging outrank a Vercel production deployment', () => {
    // The day a staging project exists it has its own production branch, so
    // VERCEL_ENV would claim production there too.
    set('VERCEL', '1');
    set('VERCEL_ENV', 'production');
    set('SITE_ENV', 'staging');

    expect(getSiteEnvironment()).toBe('staging');
  });

  it('is development off Vercel', () => {
    expect(getSiteEnvironment()).toBe('development');
  });

  it('ignores a value it does not recognise', () => {
    set('SITE_ENV', 'prod');
    set('VERCEL', '1');

    expect(getSiteEnvironment()).toBe('staging');
  });
});

describe('getSiteUrl()', () => {
  it('prefers the declared URL and drops a trailing slash', () => {
    set('SITE_URL', 'https://yuancong.space/');

    expect(getSiteUrl()).toBe('https://yuancong.space');
  });

  it('falls back to the Vercel deployment URL', () => {
    set('VERCEL_URL', 'site-abc123.vercel.app');

    expect(getSiteUrl()).toBe('https://site-abc123.vercel.app');
  });

  it('falls back to localhost', () => {
    expect(getSiteUrl()).toBe('http://localhost:3000');
  });
});
