import { describe, expect, it } from 'vitest';

import {
  nextPublishedAt,
  parsePostForm,
  readLanguage,
  readTags,
  slugify,
} from './post-form';

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);

  return data;
};

describe('slugify()', () => {
  it.each([
    ['Hello World', 'hello-world'],
    ['  Spaced  out  ', 'spaced-out'],
    ['Next.js 16 & Turbopack', 'next-js-16-turbopack'],
    ['--already--slugged--', 'already-slugged'],
  ])('turns %s into %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it('strips characters a URL should not carry, including CJK', () => {
    expect(slugify('聊一聊 Persona')).toBe('persona');
  });
});

describe('readTags()', () => {
  it('splits, trims and drops blanks', () => {
    expect(readTags(' CSS , Frontend ,, ')).toEqual(['CSS', 'Frontend']);
  });

  it('removes duplicates', () => {
    expect(readTags('CSS, CSS')).toEqual(['CSS']);
  });
});

describe('readLanguage()', () => {
  it('accepts the languages the check constraint allows', () => {
    expect(readLanguage('日本語')).toBe('日本語');
  });

  it('falls back rather than letting Postgres reject the row', () => {
    expect(readLanguage('Klingon')).toBe('English');
  });
});

describe('nextPublishedAt()', () => {
  const now = new Date('2026-09-17T00:00:00Z');

  it('stamps now when publishing something that never was', () => {
    expect(nextPublishedAt('publish', null, now)).toBe(now.toISOString());
  });

  it('keeps the original date when re-publishing', () => {
    const original = '2024-10-02T08:20:50.000Z';
    expect(nextPublishedAt('publish', original, now)).toBe(original);
  });

  it('clears the date when unpublishing', () => {
    expect(nextPublishedAt('unpublish', '2024-10-02T08:20:50.000Z', now)).toBe(
      null
    );
  });

  it('leaves the date alone on a plain save', () => {
    expect(nextPublishedAt('save', null, now)).toBe(null);
    expect(nextPublishedAt('save', '2024-01-01T00:00:00.000Z', now)).toBe(
      '2024-01-01T00:00:00.000Z'
    );
  });
});

describe('parsePostForm()', () => {
  const now = new Date('2026-09-17T00:00:00Z');

  it('rejects an empty title', () => {
    const result = parsePostForm(form({ title: '   ' }), now);

    expect(result).toEqual({ ok: false, message: 'A title is required.' });
  });

  it('rejects a slug that reduces to nothing', () => {
    const result = parsePostForm(form({ title: 'Ok', slug: '???' }), now);

    expect(result.ok).toBe(false);
  });

  it('derives the slug from the title when the field is empty', () => {
    const result = parsePostForm(form({ title: 'Hello World' }), now);

    expect(result.ok && result.values.slug).toBe('hello-world');
  });

  it('builds the row a publish writes', () => {
    const result = parsePostForm(
      form({
        title: 'Subgrid',
        slug: 'subgrid',
        summary: '  ',
        body: '# Hi',
        language: '中文',
        tags: 'CSS, Frontend',
        intent: 'publish',
        publishedAt: '',
      }),
      now
    );

    expect(result.ok && result.values).toEqual({
      slug: 'subgrid',
      title: 'Subgrid',
      summary: null,
      body: '# Hi',
      language: '中文',
      tags: ['CSS', 'Frontend'],
      published_at: now.toISOString(),
    });
  });
});
