import { COLUMNS, LIST_COLUMNS, toPost } from '@yc/content';
import type { Post, PostRow } from '@yc/content';

import { createClient } from '@/lib/supabase/server';

/**
 * Drafts are visible here and nowhere else: the `posts_author_read` policy adds
 * them for a signed-in author, on top of the published rows everyone can see.
 */
export const getPosts = async (): Promise<Post[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select(LIST_COLUMNS)
    .order('published_at', { ascending: false, nullsFirst: true })
    .order('updated_at', { ascending: false });

  if (error) throw new Error(`failed to load posts: ${error.message}`);

  return ((data ?? []) as unknown as PostRow[]).map(toPost);
};

export const getPostById = async (id: string): Promise<Post | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select(COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`failed to load post: ${error.message}`);

  return data ? toPost(data as unknown as PostRow) : null;
};
