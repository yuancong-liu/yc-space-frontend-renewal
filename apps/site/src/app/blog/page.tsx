import type { Metadata } from 'next';
import Link from 'next/link';

import { PostCard } from '@/components/pages/blog/post-card';
import { getPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog | YC Space',
};

export const revalidate = 300;

const BlogPage = async () => {
  const posts = await getPosts();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-text">Blog</h1>
        <Link className="text-sm text-accent-2 underline" href="/blog/tags">
          Browse tags
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-text/70">No posts yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogPage;
