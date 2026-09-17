'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

const TABS = [
  { id: 'posts', label: 'Posts' },
  { id: 'tags', label: 'Tags' },
  { id: 'links', label: 'Links' },
] as const;

type TabId = (typeof TABS)[number]['id'];

type BlogTabsProps = {
  links: ReactNode;
  posts: ReactNode;
  tags: ReactNode;
};

/**
 * The index switches between three views rather than stacking them, with the
 * selected label set several times larger than the others — the previous
 * site's blog header, which doubled as its navigation.
 *
 * Panels are rendered on the server and handed in, so switching costs nothing
 * and the archive is in the HTML whichever tab is open.
 */
export const BlogTabs = ({ links, posts, tags }: BlogTabsProps) => {
  const [active, setActive] = useState<TabId>('posts');
  const panels: Record<TabId, ReactNode> = { posts, tags, links };

  return (
    <>
      <div className="blog-tabs" role="tablist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            aria-controls={`blog-panel-${id}`}
            aria-selected={active === id}
            className="blog-tab"
            data-active={active === id || undefined}
            id={`blog-tab-${id}`}
            role="tab"
            type="button"
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {TABS.map(({ id }) => (
        <div
          key={id}
          aria-labelledby={`blog-tab-${id}`}
          hidden={active !== id}
          id={`blog-panel-${id}`}
          role="tabpanel"
        >
          {panels[id]}
        </div>
      ))}
    </>
  );
};
