import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Markdown } from '@yc/markdown';

import { getPostBySlug, getPosts } from '@/lib/posts';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

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

  return { title: `${post.title} | YC Space`, description: post.summary };
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-text">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-text/60">
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          {post.tags.map(tag => (
            <span key={tag} className="rounded-full bg-bg-2 px-3 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <Markdown source={post.body} />
    </article>
  );
};

export default BlogPostPage;
