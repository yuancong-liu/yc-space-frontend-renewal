import Link from 'next/link';

import type { Tag } from '@/lib/posts';

type TagListProps = {
  tags: Tag[];
};

export const TagList = ({ tags }: TagListProps) =>
  tags.length === 0 ? (
    <p className='blog-empty'>No tags yet.</p>
  ) : (
    <ul className='tag-list'>
      {tags.map(tag => (
        <li key={tag.slug} className='tag-item'>
          <Link href={`/blog/tags/${tag.slug}`}>{tag.name}</Link>
        </li>
      ))}
    </ul>
  );
