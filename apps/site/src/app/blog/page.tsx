import type { Metadata } from 'next';

import { BlogTabs } from '@/components/pages/blog/blog-tabs';
import { PostList } from '@/components/pages/blog/post-list';
import { SocialLinks } from '@/components/pages/blog/social-links';
import { TagList } from '@/components/pages/blog/tag-list';
import { getPosts, getTags } from '@/lib/posts';

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
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);

  return (
    <div className="blog-page">
      <BlogTabs
        links={<SocialLinks />}
        posts={<PostList posts={posts} />}
        tags={<TagList tags={tags} />}
      />
    </div>
  );
};

export default BlogPage;
