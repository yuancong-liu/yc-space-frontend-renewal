import type { Metadata } from 'next';
import Link from 'next/link';

import { getTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tags | YC Space',
};

export const revalidate = 300;

const TagsPage = async () => {
  const tags = await getTags();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-text">Tags</h1>

      {tags.length === 0 ? (
        <p className="text-sm text-text/70">No tags yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {tags.map(tag => (
            <li key={tag.slug}>
              <Link
                className="flex items-baseline gap-2 rounded-full border border-bg-2/60 px-4 py-1.5 text-sm transition-colors hover:border-accent-2 hover:text-accent-2"
                href={`/blog/tags/${tag.slug}`}
              >
                <span>#{tag.name}</span>
                <span className="text-xs text-text/50">{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagsPage;
