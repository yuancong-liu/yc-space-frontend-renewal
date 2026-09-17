import { LIST_COLUMNS, COLUMNS, tagSlug, toPost } from '@yc/content';
import type { Post, PostRow } from '@yc/content';

import { getSupabase } from '@/lib/supabase';

export type Tag = {
  name: string;
  slug: string;
  count: number;
};

/**
 * Drafts and scheduled posts never reach here: the row level security policy
 * on `posts` already limits the anon key to rows whose publish date has passed.
 * The ordering is the only thing these queries add.
 */
const listRows = async () => {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('posts')
    .select(LIST_COLUMNS)
    .order('published_at', { ascending: false });

  if (error) throw new Error(`failed to load posts: ${error.message}`);

  return (data ?? []) as unknown as PostRow[];
};

export const getPosts = async (): Promise<Post[]> =>
  (await listRows()).map(toPost);

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('posts')
    .select(COLUMNS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw new Error(`failed to load ${slug}: ${error.message}`);

  return data ? toPost(data as unknown as PostRow) : null;
};

/**
 * Tags are an array column rather than their own table, so the counts are
 * gathered here. The archive is small enough that one query beats a view.
 */
export const getTags = async (): Promise<Tag[]> => {
  const counts = new Map<string, number>();

  for (const row of await listRows()) {
    for (const tag of row.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export const getPostsByTag = async (
  slug: string
): Promise<{ tag: string; posts: Post[] } | null> => {
  const rows = await listRows();
  // Match on the slug, because that is what the URL carries — the tag's display
  // form comes back from whichever posts matched.
  const matches = rows.filter(row =>
    (row.tags ?? []).some(tag => tagSlug(tag) === slug)
  );

  if (matches.length === 0) return null;

  const name = (matches[0].tags ?? []).find(tag => tagSlug(tag) === slug);

  return { tag: name ?? slug, posts: matches.map(toPost) };
};

/**
 * Neighbours in publish order. The previous site put the older post on the left
 * and the newer on the right, which is the order the archive itself reads in.
 */
export const getAdjacentPosts = async (slug: string) => {
  const posts = await getPosts();
  const index = posts.findIndex(post => post.slug === slug);

  if (index === -1) return { previous: null, next: null };

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
};
