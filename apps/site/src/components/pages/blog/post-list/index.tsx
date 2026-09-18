import type { Post } from '@yc/content';

import { PostCard } from '@/components/pages/blog/post-card';

type PostListProps = {
  posts: Post[];
};

export const PostList = ({ posts }: PostListProps) =>
  posts.length === 0 ? (
    <p className='blog-empty'>Nothing here yet.</p>
  ) : (
    <ul className='post-list'>
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </ul>
  );
