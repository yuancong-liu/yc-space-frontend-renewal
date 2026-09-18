'use client';

import type { MouseEvent } from 'react';

import { Button } from '@yc/ui';

import { deletePost } from '@/app/(app)/posts/actions';

/**
 * The delete form is a sibling of the editor form, not a child — nesting forms
 * is invalid HTML — and the button reaches it through the `form` attribute.
 * Confirmation matters here: the button sits next to Save in a focused editor.
 */
export const DeletePostForm = ({ id }: { id: string }) => (
  <form action={deletePost} id='delete-post'>
    <input name='id' type='hidden' value={id} />
  </form>
);

export const DeletePostButton = ({ title }: { title: string }) => {
  const confirmAndDelete = (event: MouseEvent<HTMLButtonElement>) => {
    const { form } = event.currentTarget;

    if (form && window.confirm(`Delete “${title}”? This cannot be undone.`)) {
      form.requestSubmit();
    }
  };

  return (
    <Button
      form='delete-post'
      size='sm'
      type='button'
      variant='ghost'
      onClick={confirmAndDelete}
    >
      Delete
    </Button>
  );
};
