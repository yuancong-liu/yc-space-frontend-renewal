'use client';

import { useEffect, useId, useState } from 'react';

type TocEntry = {
  id: string;
  level: 2 | 3;
  title: string;
};

const getTocEntries = (): TocEntry[] =>
  Array.from(
    document.querySelectorAll<HTMLHeadingElement>(
      '.post-content .yc-markdown h2[id], .post-content .yc-markdown h3[id]'
    )
  ).flatMap(heading => {
    const level = Number(heading.tagName.slice(1));
    const title = heading.textContent?.trim() ?? '';

    return level === 2 || level === 3 ? [{ id: heading.id, level, title }] : [];
  });

export const PostToc = () => {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [open, setOpen] = useState(false);
  const navId = useId();

  useEffect(() => {
    setEntries(getTocEntries());
  }, []);

  if (entries.length === 0) return null;

  return (
    <aside className='post-toc'>
      <button
        aria-controls={navId}
        aria-expanded={open}
        aria-label='Toggle table of contents'
        className='post-toc-trigger'
        type='button'
        onClick={() => setOpen(isOpen => !isOpen)}
      >
        <svg aria-hidden fill='none' viewBox='0 0 24 24'>
          <path d='M4 6h16M4 12h16M4 18h16' />
        </svg>
      </button>

      <nav
        aria-label='On this page'
        className='post-toc-nav'
        data-open={open}
        id={navId}
      >
        <ol className='post-toc-list'>
          {entries.map(({ id, level, title }) => (
            <li key={id}>
              <a
                data-level={level}
                href={`#${id}`}
                onClick={() => setOpen(false)}
              >
                {title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
};
