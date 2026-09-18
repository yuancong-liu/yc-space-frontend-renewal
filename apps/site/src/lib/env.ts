export type SiteEnvironment = 'production' | 'staging' | 'development';

/**
 * Which deployment this is.
 *
 * `SITE_ENV` wins when it is set, and it has to be set the day a second Vercel
 * project serves the site: a staging project has its own production branch, so
 * `VERCEL_ENV` reads `production` there too, and inferring would de-index the
 * real site or index the copy.
 *
 * With one project — the arrangement today — `VERCEL_ENV` says it correctly on
 * its own, so the production deployment needs no variable to be indexed and a
 * branch preview is marked without anyone remembering to.
 */
export const getSiteEnvironment = (): SiteEnvironment => {
  const declared = process.env.SITE_ENV;

  if (declared === 'production' || declared === 'staging') return declared;
  if (declared === 'development') return 'development';

  if (process.env.VERCEL_ENV === 'production') return 'production';

  // Any other Vercel build is a preview: unindexed and marked, which is the
  // safe way to be wrong about a deployment nobody declared.
  return process.env.VERCEL ? 'staging' : 'development';
};

export const isProductionSite = () => getSiteEnvironment() === 'production';

/**
 * Canonical origin for this deployment, used for metadataBase, the sitemap and
 * canonical links. Each deployment sets its own, so staging never claims to be
 * the production URL.
 */
export const getSiteUrl = () => {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return 'http://localhost:3000';
};

/**
 * Shared secret the CMS presents when asking this deployment to revalidate.
 * Unset means the endpoint refuses everything, which is the right default for
 * a deployment that has not been wired up yet.
 */
export const getRevalidateSecret = () => process.env.REVALIDATE_SECRET ?? null;
