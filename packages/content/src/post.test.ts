import { describe, expect, it } from 'vitest';

import { excerpt } from './excerpt';
import { RECENT_DAYS, isRecent, postStatus, tagSlug, toPost } from './post';
import type { PostRow } from './post';

const row = (overrides: Partial<PostRow> = {}): PostRow => ({
  id: 'id-1',
  slug: 'hello',
  title: 'Hello',
  summary: null,
  body: 'Body',
  language: '中文',
  tags: ['CSS', 'Frontend'],
  published_at: '2024-10-02T17:20:50+09:00',
  created_at: '2024-10-02T17:20:50+09:00',
  updated_at: '2024-10-02T17:20:50+09:00',
  ...overrides,
});

describe('toPost()', () => {
  it('maps a row to camelCase', () => {
    const post = toPost(row());

    expect(post).toMatchObject({
      slug: 'hello',
      language: '中文',
      tags: ['CSS', 'Frontend'],
      publishedAt: '2024-10-02T17:20:50+09:00',
    });
  });

  it('falls back to English for a language the app does not know', () => {
    expect(toPost(row({ language: 'Klingon' })).language).toBe('English');
  });

  it('treats a null tags column as no tags', () => {
    expect(toPost(row({ tags: null })).tags).toEqual([]);
  });

  it('accepts a partial row, so a listing query can omit the body', () => {
    const { body, ...listRow } = row();

    expect(toPost(listRow).body).toBe('');
    expect(body).toBe('Body');
  });
});

describe('postStatus()', () => {
  const now = new Date('2024-10-02T12:00:00Z');

  it('is a draft without a publish date', () => {
    expect(postStatus(toPost(row({ published_at: null })), now)).toBe('draft');
  });

  it('is scheduled when the publish date is still ahead', () => {
    const future = '2024-10-03T00:00:00Z';
    expect(postStatus(toPost(row({ published_at: future })), now)).toBe(
      'scheduled'
    );
  });

  it('is published once the date has passed', () => {
    const past = '2024-10-01T00:00:00Z';
    expect(postStatus(toPost(row({ published_at: past })), now)).toBe(
      'published'
    );
  });
});

describe('isRecent()', () => {
  const now = new Date('2026-09-17T00:00:00Z');
  const daysAgo = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  it('marks a post published inside the window', () => {
    expect(isRecent(toPost(row({ published_at: daysAgo(1) })), now)).toBe(true);
  });

  it('stops at the edge of the window', () => {
    expect(
      isRecent(toPost(row({ published_at: daysAgo(RECENT_DAYS) })), now)
    ).toBe(true);
    expect(
      isRecent(toPost(row({ published_at: daysAgo(RECENT_DAYS + 1) })), now)
    ).toBe(false);
  });

  it('is false for a draft', () => {
    expect(isRecent(toPost(row({ published_at: null })), now)).toBe(false);
  });

  it('is false for a scheduled post — it is not out yet', () => {
    expect(isRecent(toPost(row({ published_at: daysAgo(-2) })), now)).toBe(
      false
    );
  });
});

describe('tagSlug()', () => {
  it.each([
    ['Spring Boot', 'spring-boot'],
    ['Next.js', 'next-js'],
    ['Back-end', 'back-end'],
    ['Machine Learning', 'machine-learning'],
    // The previous site's replace was not global, so this one used to survive
    // with its second space intact.
    ['A B C', 'a-b-c'],
  ])('turns %s into %s', (tag, expected) => {
    expect(tagSlug(tag)).toBe(expected);
  });
});

describe('excerpt()', () => {
  it('takes the first real paragraph', () => {
    const body = ['# Title', '', 'First paragraph.', '', 'Second.'].join('\n');

    expect(excerpt(body)).toBe('First paragraph.');
  });

  it('strips markdown syntax rather than showing it', () => {
    const body = 'A **bold** word, `code`, and a [link](https://example.com).';

    expect(excerpt(body)).toBe('A bold word, code, and a link.');
  });

  it('skips code fences, directives and images', () => {
    const body = [
      '```ts',
      'const skipped = true;',
      '```',
      '',
      '::frame{src="https://example.com"}',
      '',
      '![alt](/img.png)',
      '',
      'The prose.',
    ].join('\n');

    expect(excerpt(body)).toBe('The prose.');
  });

  it('truncates on a word boundary', () => {
    const body = `${'word '.repeat(60)}end`;
    const result = excerpt(body, 40);

    expect(result.length).toBeLessThanOrEqual(41);
    expect(result.endsWith('…')).toBe(true);
    expect(result).not.toContain('wor…');
  });

  it('truncates CJK text, which has no spaces to break on', () => {
    const body = '這'.repeat(200);
    const result = excerpt(body, 20);

    expect(result).toBe(`${'這'.repeat(20)}…`);
  });

  it('returns an empty string for a body with nothing renderable', () => {
    expect(excerpt('```\njust code\n```')).toBe('');
  });
});
