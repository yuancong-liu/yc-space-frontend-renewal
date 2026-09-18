import Link from 'next/link';

import { postStatus } from '@yc/content';
import { Button } from '@yc/ui';

import { getPosts } from '@/lib/posts';

const STATUS_LABEL = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  published: 'Published',
} as const;

const PostsPage = async () => {
  const posts = await getPosts();

  return (
    <main className='cms-main flex flex-col gap-6'>
      <div className='flex items-baseline justify-between gap-4'>
        <h1 className='text-2xl font-semibold text-text'>Posts</h1>
        <Link href='/posts/new'>
          <Button size='sm'>New post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className='cms-card text-sm text-text/70'>
          Nothing here yet. If the archive should be showing, check that your
          address is in the <code>authors</code> table.
        </p>
      ) : (
        <ul className='flex flex-col gap-2'>
          {posts.map(post => {
            const status = postStatus(post);

            return (
              <li key={post.id}>
                <Link
                  className='flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-xl border border-bg-2/60 px-4 py-3 transition-colors hover:border-accent-2'
                  href={`/posts/${post.id}`}
                >
                  <span className='cms-status' data-status={status}>
                    {STATUS_LABEL[status]}
                  </span>
                  <span className='flex-1 text-text'>{post.title}</span>
                  <span className='font-mono text-xs text-text/40'>
                    {post.slug}
                  </span>
                  <span className='text-xs text-text/50'>{post.language}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default PostsPage;
