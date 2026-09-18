import type { ReactNode } from 'react';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

import { EnvBanner } from '@/components/common/env-banner';
import { SiteHeader } from '@/components/common/site-header';
import { getSiteUrl, isProductionSite } from '@/lib/env';
import { fontVariables } from '@/styles/fonts';

import '@/styles/globals.css';

/**
 * `metadataBase` is what makes the relative canonicals on the blog pages
 * resolve, and it is per-deployment: staging must claim its own origin rather
 * than point every canonical at production.
 *
 * robots.ts already keeps crawlers off staging; the meta tag says the same
 * thing to anything that fetches a page without reading robots.txt first.
 */
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: 'YC Space', template: '%s | YC Space' },
  description: 'YC Space',
  robots: isProductionSite()
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html className={fontVariables} lang='en'>
    <body className='antialiased'>
      <EnvBanner />
      <SiteHeader />
      <main className='site-main'>{children}</main>
      <div className='common-background' />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
