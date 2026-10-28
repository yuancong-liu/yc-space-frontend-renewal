import type { Metadata } from 'next';

import { PostList } from '@/components/pages/blog/post-list';
import { getPosts } from '@/lib/posts';

export const revalidate = 300;

export const generateMetadata = async (): Promise<Metadata> => {
  const [latest] = await getPosts();

  return {
    title: "YC's Blog",
    description: latest
      ? `Welcome to YC's blog! Read the latest post: ${latest.title}`
      : "Welcome to YC's blog!",
  };
};

const BlogPage = async () => {
  const posts = await getPosts();

  return (
    <div className='blog-page'>
      <PostList posts={posts} />
    </div>
  );
};

export default BlogPage;
