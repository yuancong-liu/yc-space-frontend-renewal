import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostCard } from '@/components/pages/blog/post-card';
import { getPostsByTag, getTags } from '@/lib/posts';

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export const revalidate = 300;

export const generateStaticParams = async () => {
  const tags = await getTags();

  return tags.map(({ slug }) => ({ tag: slug }));
};

export const generateMetadata = async ({
  params,
}: TagPageProps): Promise<Metadata> => {
  const { tag } = await params;
  const match = await getPostsByTag(tag);

  return match ? { title: `#${match.tag} | YC Space` } : {};
};

const TagPage = async ({ params }: TagPageProps) => {
  const { tag } = await params;
  const match = await getPostsByTag(tag);

  if (!match) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-text">
          #{match.tag}
        </h1>
        <Link className="text-sm text-accent-2 underline" href="/blog/tags">
          All tags
        </Link>
      </div>

      <ul className="flex flex-col gap-4">
        {match.posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </div>
  );
};

export default TagPage;
