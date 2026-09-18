export type SiteEnvironment = 'production' | 'staging' | 'development';

/**
 * Which deployment this is.
 *
 * Deliberately not derived from `VERCEL_ENV`: staging is its own Vercel project
 * with its own production branch, so Vercel reports `production` there too.
 * Getting this wrong means either indexing the staging site or de-indexing the
 * real one, so it has to be stated rather than inferred.
 */
export const getSiteEnvironment = (): SiteEnvironment => {
  const declared = process.env.SITE_ENV;

  if (declared === 'production' || declared === 'staging') return declared;
  if (declared === 'development') return 'development';

  // Nothing declared: a Vercel build is treated as staging, which is the safe
  // way to be wrong — an unindexed real site beats an indexed preview.
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
