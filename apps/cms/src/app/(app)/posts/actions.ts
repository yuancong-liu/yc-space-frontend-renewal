'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { parsePostForm } from '@/lib/post-form';
import { createClient } from '@/lib/supabase/server';

export type SaveState = {
  status: 'idle' | 'saved' | 'error';
  message: string;
};

export const INITIAL_SAVE_STATE: SaveState = { status: 'idle', message: '' };

const UNIQUE_VIOLATION = '23505';

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

  if (!id) redirect(`/posts/${data.id}`);

  return { status: 'saved', message: 'Saved.' };
};

export const deletePost = async (formData: FormData) => {
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);

  if (error) throw new Error(`failed to delete post: ${error.message}`);

  revalidatePath('/posts');
  redirect('/posts');
};
