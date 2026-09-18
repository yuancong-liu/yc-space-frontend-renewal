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

  it('treats an undeclared Vercel build as staging', () => {
    // Staging is its own Vercel project, so VERCEL_ENV says "production" there
    // too. Assuming staging is the safe way to be wrong.
    set('VERCEL', '1');

    expect(getSiteEnvironment()).toBe('staging');
    expect(isProductionSite()).toBe(false);
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
