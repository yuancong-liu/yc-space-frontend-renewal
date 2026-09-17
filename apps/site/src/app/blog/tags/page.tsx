import type { Metadata } from 'next';

import { PageHeader } from '@/components/pages/blog/page-header';
import { TagList } from '@/components/pages/blog/tag-list';
import { getTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tags',
};

export const revalidate = 300;

const TagsPage = async () => {
  const tags = await getTags();

  return (
    <>
      <PageHeader>Tags</PageHeader>
      <main className="blog-page">
        <TagList tags={tags} />
      </main>
    </>
  );
};

export default TagsPage;
