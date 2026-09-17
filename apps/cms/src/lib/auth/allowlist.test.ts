import { afterEach, describe, expect, it } from 'vitest';

import { getAllowedEmails, isAllowedEmail } from './allowlist';

const setAllowlist = (value: string | undefined) => {
  if (value === undefined) {
    delete process.env.CMS_ALLOWED_EMAILS;
    return;
  }

  process.env.CMS_ALLOWED_EMAILS = value;
};

afterEach(() => {
  setAllowlist(undefined);
});

describe('getAllowedEmails()', () => {
  it('returns an empty list when the variable is unset', () => {
    expect(getAllowedEmails()).toEqual([]);
  });

  it('splits, trims and lowercases the configured addresses', () => {
    setAllowlist(' First@Example.com , second@example.com ');

    expect(getAllowedEmails()).toEqual([
      'first@example.com',
      'second@example.com',
    ]);
  });

  it('drops empty entries from a trailing comma', () => {
    setAllowlist('me@example.com,');

    expect(getAllowedEmails()).toEqual(['me@example.com']);
  });
});

describe('isAllowedEmail()', () => {
  it('fails closed when no allowlist is configured', () => {
    expect(isAllowedEmail('me@example.com')).toBe(false);
  });

  it('rejects null, undefined and empty addresses', () => {
    setAllowlist('me@example.com');

    expect(isAllowedEmail(null)).toBe(false);
    expect(isAllowedEmail(undefined)).toBe(false);
    expect(isAllowedEmail('')).toBe(false);
  });

  it('matches regardless of case and surrounding whitespace', () => {
    setAllowlist('me@example.com');

    expect(isAllowedEmail('ME@Example.com')).toBe(true);
    expect(isAllowedEmail('  me@example.com  ')).toBe(true);
  });

  it('rejects an address that is not on the list', () => {
    setAllowlist('me@example.com');

    expect(isAllowedEmail('someone-else@example.com')).toBe(false);
  });
});
