import Link from 'next/link';

import { getPosts } from '@/lib/posts';

const BlogPage = async () => {
  const posts = await getPosts();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">Blog</h1>

      <ul className="flex flex-col gap-4">
        {posts.map(post => (
          <li key={post.slug}>
            <Link
              className="block rounded-2xl border border-bg-2/60 bg-bg-1/60 p-5 transition-colors hover:border-accent-2"
              href={`/blog/${post.slug}`}
            >
              <h2 className="font-serif text-xl font-semibold text-text">{post.title}</h2>
              <p className="mt-1 text-sm text-text/70">{post.summary}</p>
              <time
                className="mt-3 block text-xs text-text/50"
                dateTime={post.publishedAt}
              >
                {post.publishedAt}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPage;
