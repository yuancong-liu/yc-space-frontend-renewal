import Link from 'next/link';

import { excerpt } from '@yc/content';
import type { Post } from '@yc/content';

import { formatPostDate } from '@/lib/dates';

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => (
  <li>
    <Link
      className="block rounded-2xl border border-bg-2/60 bg-bg-1/50 p-5 transition-colors hover:border-accent-2"
      href={`/blog/${post.slug}`}
    >
      <h2 className="font-serif text-xl font-semibold text-text">
        {post.title}
      </h2>
      <p className="mt-2 text-sm text-text/70">
        {post.summary ?? excerpt(post.body)}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text/50">
        {post.publishedAt && (
          <time dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
        )}
        <span>{post.language}</span>
        {post.tags.map(tag => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>
    </Link>
  </li>
);
