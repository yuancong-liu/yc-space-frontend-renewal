/**
 * Tells every configured site deployment that a post changed, so it refreshes
 * now rather than when its revalidate window happens to expire.
 *
 * A comma-separated list because production and staging serve the same content
 * from different origins: publishing should refresh both. An origin that is not
 * listed simply keeps waiting out its own window.
 */
const ORIGINS_VAR = 'SITE_REVALIDATE_ORIGINS';
const SECRET_HEADER = 'x-revalidate-secret';
const TIMEOUT_MS = 5000;

export type RevalidateOutcome = {
  attempted: number;
  failed: string[];
};

export const getRevalidateOrigins = () =>
  (process.env[ORIGINS_VAR] ?? '')
    .split(',')
    .map(origin => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

type Change = {
  slug: string;
  previousSlug?: string;
};

/**
 * Never throws: a site that is down, misconfigured or slow must not turn a
 * successful save into a failed one. The caller reports what did not reach.
 */
export const revalidateSite = async (
  change: Change
): Promise<RevalidateOutcome> => {
  const origins = getRevalidateOrigins();
  const secret = process.env.REVALIDATE_SECRET;

  if (origins.length === 0 || !secret) return { attempted: 0, failed: [] };

  const results = await Promise.all(
    origins.map(async origin => {
      try {
        const response = await fetch(`${origin}/api/revalidate`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            [SECRET_HEADER]: secret,
          },
          body: JSON.stringify(change),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });

        return response.ok ? null : origin;
      } catch {
        return origin;
      }
    })
  );

  return {
    attempted: origins.length,
    failed: results.filter((origin): origin is string => origin !== null),
  };
};
