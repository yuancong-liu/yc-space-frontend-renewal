/** Must match the check constraint on `posts.language`. */
export const POST_LANGUAGES = ['English', '中文', '日本語'] as const;

export type PostLanguage = (typeof POST_LANGUAGES)[number];

/** A row as Postgres returns it. */
export type PostRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  language: string;
  tags: string[] | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string;
  language: PostLanguage;
  tags: string[];
  /** Null while a draft; a future value means scheduled. */
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const COLUMNS =
  'id, slug, title, summary, body, language, tags, published_at, created_at, updated_at';

/** Columns the listing needs — a post body is far too much to send for a card. */
export const LIST_COLUMNS =
  'id, slug, title, summary, language, tags, published_at, created_at, updated_at';

const asLanguage = (value: string): PostLanguage =>
  (POST_LANGUAGES as readonly string[]).includes(value)
    ? (value as PostLanguage)
    : 'English';

export const toPost = (row: Partial<PostRow> & Pick<PostRow, 'id' | 'slug'>): Post => ({
  id: row.id,
  slug: row.slug,
  title: row.title ?? '',
  summary: row.summary ?? null,
  body: row.body ?? '',
  language: asLanguage(row.language ?? 'English'),
  tags: row.tags ?? [],
  publishedAt: row.published_at ?? null,
  createdAt: row.created_at ?? new Date(0).toISOString(),
  updatedAt: row.updated_at ?? new Date(0).toISOString(),
});

export type PostStatus = 'draft' | 'scheduled' | 'published';

export const postStatus = (post: Post, now = new Date()): PostStatus => {
  if (!post.publishedAt) return 'draft';

  return new Date(post.publishedAt) > now ? 'scheduled' : 'published';
};

/**
 * Slug for a tag URL. The previous site used a non-global replace, so only the
 * first space or dot in a tag was ever converted; every tag it had happened to
 * contain at most one.
 */
export const tagSlug = (tag: string) =>
  tag.trim().toLowerCase().replace(/[.\s]+/g, '-');
