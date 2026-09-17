import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { excerpt, tagSlug } from '@yc/content';
import { Markdown } from '@yc/markdown';

import { formatPostDate } from '@/lib/dates';
import { getPostBySlug, getPosts } from '@/lib/posts';

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

  return {
    title: `${post.title} | YC Space`,
    description: post.summary ?? excerpt(post.body),
  };
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-3">
        <h1 className="font-serif text-3xl font-semibold text-text">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-text/60">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatPostDate(post.publishedAt)}
            </time>
          )}
          <span>{post.language}</span>
          {post.tags.map(tag => (
            <Link
              key={tag}
              className="rounded-full bg-bg-2 px-3 py-0.5 transition-colors hover:text-accent-2"
              href={`/blog/tags/${tagSlug(tag)}`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </header>

      <Markdown source={post.body} />
    </article>
  );
};

export default BlogPostPage;
