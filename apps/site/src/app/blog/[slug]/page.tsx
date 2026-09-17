import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { excerpt, tagSlug } from '@yc/content';
import { Markdown } from '@yc/markdown';

import { AdjacentPosts } from '@/components/pages/blog/adjacent-posts';
import { formatPostDate } from '@/lib/dates';
import { getAdjacentPosts, getPostBySlug, getPosts } from '@/lib/posts';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export const generateStaticParams = async () => {
  const posts = await getPosts();

  return posts.map(({ slug }) => ({ slug }));
};

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  const description = post.summary ?? excerpt(post.body);

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt ?? undefined,
    },
  };
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const { next, previous } = await getAdjacentPosts(slug);

  return (
    <>
      <h1 className="post-title">{post.title}</h1>

      <header className="post-header">
        <ul className="post-header-tags">
          {post.tags.map(tag => (
            <li key={tag} className="tag-item">
              <Link href={`/blog/tags/${tagSlug(tag)}`}>{tag}</Link>
            </li>
          ))}
        </ul>
        {post.publishedAt && (
          <time className="post-header-date" dateTime={post.publishedAt}>
            {formatPostDate(post.publishedAt)}
          </time>
        )}
      </header>

      <main className="post-main">
        <Markdown source={post.body} />
        <AdjacentPosts next={next} previous={previous} />
      </main>
    </>
  );
};

export default BlogPostPage;
