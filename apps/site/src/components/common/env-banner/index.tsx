import { getSiteEnvironment, isProductionSite } from '@/lib/env';

/**
 * Staging serves the same content as production on a different origin, so
 * without a marker the two are indistinguishable in a screenshot or a shared
 * link. Production renders nothing.
 */
export const EnvBanner = () => {
  if (isProductionSite()) return null;

  return (
    <div className='site-env-banner' role='status'>
      <strong>{getSiteEnvironment()}</strong>
      <span>not indexed — content matches production</span>
    </div>
  );
};
