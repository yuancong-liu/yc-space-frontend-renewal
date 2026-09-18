export type RevalidateRequest = {
  slug?: string;
  previousSlug?: string;
};

export type RevalidateTarget = {
  path: string;
  type?: 'page' | 'layout';
};

/**
 * Which pages a post change invalidates.
 *
 * Tag pages are revalidated as a route pattern rather than one by one: a post's
 * tags can be added or removed, so the pages that need refreshing include ones
 * the post is no longer on. There are a couple of dozen of them and they are
 * cheap to rebuild, which is a better trade than tracking the difference.
 */
export const revalidateTargets = ({
  previousSlug,
  slug,
}: RevalidateRequest): RevalidateTarget[] => {
  const targets: RevalidateTarget[] = [
    { path: '/blog' },
    { path: '/blog/tags' },
    { path: '/blog/tags/[tag]', type: 'page' },
  ];

  // A renamed post leaves its old URL cached, so both are refreshed.
  for (const value of new Set([slug, previousSlug].filter(Boolean))) {
    targets.push({ path: `/blog/${value}` });
  }

  return targets;
};
