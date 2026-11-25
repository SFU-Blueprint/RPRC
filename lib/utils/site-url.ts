/**
 * The app's public origin (`NEXT_PUBLIC_SITE_URL`), for absolute links in Stripe return URLs
 * and emails. In local development the request's origin is accepted as a fallback. Must
 * use HTTPS outside local development.
 */
export function getSiteUrl(requestOrigin?: string): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteUrl =
    configuredUrl ||
    (process.env.NODE_ENV === 'development' ? requestOrigin : undefined);
  if (!siteUrl) throw new Error('NEXT_PUBLIC_SITE_URL is not configured.');

  const url = new URL(siteUrl);
  if (url.protocol !== 'https:' && process.env.NODE_ENV !== 'development') {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must use HTTPS outside local development.',
    );
  }
  return url.origin;
}
