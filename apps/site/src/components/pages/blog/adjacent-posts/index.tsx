import Link from 'next/link';

import type { Post } from '@yc/content';

type AdjacentPostsProps = {
  next: Post | null;
  previous: Post | null;
};

type AdjacentPostProps = {
  direction: 'previous' | 'next';
  post: Post | null;
};

const LABEL = { previous: 'Previous', next: 'Next' } as const;

const AdjacentPost = ({ direction, post }: AdjacentPostProps) =>
  post ? (
    <Link
      className="adjacent-post"
      data-direction={direction}
      href={`/blog/${post.slug}`}
    >
      <span className="adjacent-post-label">{LABEL[direction]}</span>
      <span className="adjacent-post-title">{post.title}</span>
    </Link>
  ) : (
    <span />
  );

export const AdjacentPosts = ({ next, previous }: AdjacentPostsProps) =>
  previous || next ? (
    <nav className="adjacent-posts">
      <AdjacentPost direction="previous" post={previous} />
      <AdjacentPost direction="next" post={next} />
    </nav>
  ) : null;
