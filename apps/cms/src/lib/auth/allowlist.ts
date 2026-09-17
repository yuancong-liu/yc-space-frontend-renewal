/**
 * The CMS is a single-author back office: Supabase authenticates the e-mail
 * address, this allowlist decides whether that address may get in at all.
 *
 * Configured through `CMS_ALLOWED_EMAILS` as a comma-separated list. An empty
 * or missing value locks everyone out — failing closed beats an open CMS.
 */
export const getAllowedEmails = (): string[] =>
  (process.env.CMS_ALLOWED_EMAILS ?? '')
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

export const isAllowedEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;

  return getAllowedEmails().includes(email.trim().toLowerCase());
};
