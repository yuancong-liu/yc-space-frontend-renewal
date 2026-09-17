import { POST_LANGUAGES } from '@yc/content';
import type { PostLanguage } from '@yc/content';

export type SaveIntent = 'save' | 'publish' | 'unpublish';

export type PostValues = {
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  language: PostLanguage;
  tags: string[];
  published_at: string | null;
};

export type ParseResult =
  | { ok: true; values: PostValues }
  | { ok: false; message: string };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const readTags = (value: string) => [
  ...new Set(
    value
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
  ),
];

export const readLanguage = (value: string): PostLanguage =>
  (POST_LANGUAGES as readonly string[]).includes(value)
    ? (value as PostLanguage)
    : 'English';

/**
 * Publishing keeps an existing date rather than resetting it, so re-publishing
 * a post that was pulled down does not silently move it to the top of the
 * archive. Saving never changes the date at all.
 */
export const nextPublishedAt = (
  intent: SaveIntent,
  current: string | null,
  now = new Date()
) => {
  if (intent === 'unpublish') return null;
  if (intent === 'publish') return current || now.toISOString();

  return current || null;
};

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? '');

export const parsePostForm = (
  formData: FormData,
  now = new Date()
): ParseResult => {
  const title = text(formData, 'title').trim();
  if (!title) return { ok: false, message: 'A title is required.' };

  // An empty slug field means "follow the title", which is what an author
  // expects on a new post and never surprises them on an existing one.
  const slug = slugify(text(formData, 'slug') || title);
  if (!SLUG_PATTERN.test(slug)) {
    return {
      ok: false,
      message: 'The slug needs at least one letter or digit.',
    };
  }

  const intent = text(formData, 'intent') as SaveIntent;
  const summary = text(formData, 'summary').trim();

  return {
    ok: true,
    values: {
      slug,
      title,
      summary: summary || null,
      body: text(formData, 'body'),
      language: readLanguage(text(formData, 'language')),
      tags: readTags(text(formData, 'tags')),
      published_at: nextPublishedAt(intent, text(formData, 'publishedAt') || null, now),
    },
  };
};
