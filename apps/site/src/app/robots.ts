import type { MetadataRoute } from 'next';

import { getSiteUrl, isProductionSite } from '@/lib/env';

/**
 * Staging shares its content with production, so without this the two compete
 * for the same search results. Only the production deployment is crawlable.
 */
const robots = (): MetadataRoute.Robots => {
  const siteUrl = getSiteUrl();

  if (!isProductionSite()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
};

export default robots;
