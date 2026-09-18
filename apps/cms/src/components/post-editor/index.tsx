'use client';

import { useActionState, useDeferredValue, useState } from 'react';

import { POST_LANGUAGES, postStatus } from '@yc/content';
import type { Post } from '@yc/content';
import { Markdown } from '@yc/markdown';
import { Button, Input, Label } from '@yc/ui';

import { INITIAL_SAVE_STATE, savePost } from '@/app/(app)/posts/actions';
import { DeletePostButton } from '@/components/delete-post-button';

type PostEditorProps = {
  post: Post | null;
};

const STATUS_LABEL = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
} as const;

export const PostEditor = ({ post }: PostEditorProps) => {
  const [state, formAction, isPending] = useActionState(
    savePost,
    INITIAL_SAVE_STATE
  );
  const [body, setBody] = useState(post?.body ?? '');
  const deferredBody = useDeferredValue(body);

  const status = post ? postStatus(post) : 'draft';
  const isPublished = status !== 'draft';

  return (
    <form action={formAction} className='cms-workbench-grid'>
      <input name='id' type='hidden' value={post?.id ?? ''} />
      <input name='publishedAt' type='hidden' value={post?.publishedAt ?? ''} />

      <section className='cms-workbench-pane'>
        <header className='cms-workbench-bar'>
          <span>{post ? STATUS_LABEL[status] : 'New post'}</span>
          <span className='text-text/50'>{body.length} chars</span>
        </header>

        <div className='cms-editor-fields'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='title'>Title</Label>
            <Input
              required
              defaultValue={post?.title}
              id='title'
              name='title'
              placeholder='Post title'
            />
          </div>

          <div className='grid gap-3 sm:grid-cols-2'>
            <div className='flex flex-col gap-1'>
              <Label htmlFor='slug'>Slug</Label>
              <Input
                defaultValue={post?.slug}
                id='slug'
                name='slug'
                placeholder='derived from the title'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <Label htmlFor='language'>Language</Label>
              <select
                className='cms-select'
                defaultValue={post?.language ?? 'English'}
                id='language'
                name='language'
              >
                {POST_LANGUAGES.map(language => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <Label htmlFor='tags'>Tags</Label>
            <Input
              defaultValue={post?.tags.join(', ')}
              id='tags'
              name='tags'
              placeholder='Frontend, CSS'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <Label htmlFor='summary'>Summary</Label>
            <Input
              defaultValue={post?.summary ?? ''}
              id='summary'
              name='summary'
              placeholder='optional — the opening lines are used when empty'
            />
          </div>
        </div>

        <textarea
          aria-label='Post markdown'
          className='cms-workbench-editor'
          name='body'
          spellCheck={false}
          value={body}
          onChange={event => setBody(event.target.value)}
        />
      </section>

      <section className='cms-workbench-pane'>
        <header className='cms-workbench-bar'>
          <span>Preview</span>
          {body !== deferredBody && (
            <span className='text-text/50'>rendering…</span>
          )}
        </header>
        <div className='cms-workbench-preview'>
          <Markdown source={deferredBody} />
        </div>
      </section>

      <footer className='cms-editor-actions'>
        {state.status !== 'idle' && (
          <p
            aria-live='polite'
            className={
              state.status === 'error'
                ? 'text-sm text-accent-2'
                : 'text-sm text-text/60'
            }
            role='status'
          >
            {state.message}
          </p>
        )}

        <div className='flex items-center gap-3'>
          {post && <DeletePostButton title={post.title} />}

          <Button
            disabled={isPending}
            name='intent'
            size='sm'
            type='submit'
            value='save'
            variant='outline'
          >
            Save
          </Button>

          <Button
            disabled={isPending}
            name='intent'
            size='sm'
            type='submit'
            value={isPublished ? 'unpublish' : 'publish'}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </footer>
    </form>
  );
};
