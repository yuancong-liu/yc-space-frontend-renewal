import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/env';
import { getPosts, getTags } from '@/lib/posts';

const STATIC_PATHS = [
  '/',
  '/blog',
  '/blog/tags',
  '/portfolio',
  '/about-me',
  '/and',
];

export const revalidate = 300;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = getSiteUrl();
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);

  const lastPublished = posts[0]?.publishedAt;

  return [
    ...STATIC_PATHS.map(path => ({
      url: `${siteUrl}${path}`,
      lastModified:
        path === '/blog' && lastPublished ? new Date(lastPublished) : undefined,
    })),
    ...posts.map(post => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    })),
    ...tags.map(tag => ({
      url: `${siteUrl}/blog/tags/${tag.slug}`,
    })),
  ];
};

export default sitemap;
