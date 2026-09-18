import Link from 'next/link';

import { isRecent } from '@yc/content';
import type { Post } from '@yc/content';

import { formatPostDate } from '@/lib/dates';

type PostCardProps = {
  post: Post;
};

/**
 * A recent post gets a fry behind the card, the way it did on the previous
 * site. The language tag is shown only when the post is not in English, since
 * most of them are and labelling every card says nothing.
 */
export const PostCard = ({ post }: PostCardProps) => (
  <li className='post-card' data-recent={isRecent(post) || undefined}>
    <Link className='post-card-link' href={`/blog/${post.slug}`}>
      <div className='post-card-title-area'>
        <h2 className='post-card-title'>{post.title}</h2>
        {post.language !== 'English' && (
          <span className='post-card-language'>{post.language}</span>
        )}
      </div>
      {post.publishedAt && (
        <time className='post-card-date' dateTime={post.publishedAt}>
          {formatPostDate(post.publishedAt)}
        </time>
      )}
    </Link>
  </li>
);
