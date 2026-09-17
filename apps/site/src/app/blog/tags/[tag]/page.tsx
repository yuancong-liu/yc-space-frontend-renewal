import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/pages/blog/page-header';
import { PostList } from '@/components/pages/blog/post-list';
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

  return match ? { title: `#${match.tag}` } : {};
};

const TagPage = async ({ params }: TagPageProps) => {
  const { tag } = await params;
  const match = await getPostsByTag(tag);

  if (!match) notFound();

  return (
    <>
      <PageHeader>{match.tag}</PageHeader>
      <main className="blog-page">
        <PostList posts={match.posts} />
      </main>
    </>
  );
};

export default TagPage;
