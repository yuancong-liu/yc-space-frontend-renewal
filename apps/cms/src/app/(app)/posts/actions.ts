'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { parsePostForm } from '@/lib/post-form';
import { revalidateSite } from '@/lib/revalidate';
import type { RevalidateOutcome } from '@/lib/revalidate';
import { createClient } from '@/lib/supabase/server';

export type SaveState = {
  status: 'idle' | 'saved' | 'error';
  message: string;
};

export const INITIAL_SAVE_STATE: SaveState = { status: 'idle', message: '' };

const UNIQUE_VIOLATION = '23505';

/**
 * The write succeeded either way, so a site that did not refresh is a footnote
 * on a save rather than an error: the pages still come back on their own
 * window, and an author who sees nothing change needs to know why.
 */
const refreshNotice = ({ failed }: RevalidateOutcome) =>
  failed.length === 0
    ? ''
    : ` The site did not refresh (${failed.join(', ')}); it will catch up on its own.`;

/**
 * Reads the slug the row currently holds, before an update overwrites it: a
 * rename leaves the old URL cached under a path nothing else will invalidate.
 */
const currentSlug = async (
  supabase: Awaited<ReturnType<typeof createClient>>,
  id: string
) => {
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .eq('id', id)
    .maybeSingle();

  return data?.slug ?? undefined;
};

/**
 * Save, publish and unpublish are one action because they write the same row;
 * the submit button carries the intent, so the three share validation.
 *
 * Row level security is the real guard — a caller who is not in `authors` is
 * refused by Postgres, and the empty result that comes back is reported as
 * such rather than passed off as a save.
 */
export const savePost = async (
  _previousState: SaveState,
  formData: FormData
): Promise<SaveState> => {
  const parsed = parsePostForm(formData);
  if (!parsed.ok) return { status: 'error', message: parsed.message };

  const id = String(formData.get('id') ?? '');
  const supabase = await createClient();
  const previousSlug = id ? await currentSlug(supabase, id) : undefined;

  const { data, error } = id
    ? await supabase
        .from('posts')
        .update(parsed.values)
        .eq('id', id)
        .select('id')
        .maybeSingle()
    : await supabase
        .from('posts')
        .insert(parsed.values)
        .select('id')
        .maybeSingle();

  if (error) {
    return {
      status: 'error',
      message:
        error.code === UNIQUE_VIOLATION
          ? `The slug "${parsed.values.slug}" is already taken.`
          : error.message,
    };
  }

  if (!data) {
    return {
      status: 'error',
      message:
        'The database accepted no rows. Check that your address is in the authors table.',
    };
  }

  revalidatePath('/posts');
  // Without this the editor keeps the publish state it rendered with, so the
  // button would still read "Publish" after publishing.
  revalidatePath(`/posts/${data.id}`);

  // Every write, not only a publish: unpublishing has to take the page down,
  // and an edit to a live post has to reach it. The site decides which of its
  // paths that touches.
  const outcome = await revalidateSite({
    slug: parsed.values.slug,
    previousSlug,
  });

  if (!id) redirect(`/posts/${data.id}`);

  return { status: 'saved', message: `Saved.${refreshNotice(outcome)}` };
};

export const deletePost = async (formData: FormData) => {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  // The row is about to be gone, and its slug is the only thing that says
  // which of the site's pages have to stop serving it.
  const slug = await currentSlug(supabase, id);
  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) throw new Error(`failed to delete post: ${error.message}`);

  revalidatePath('/posts');
  if (slug) await revalidateSite({ slug });

  redirect('/posts');
};
