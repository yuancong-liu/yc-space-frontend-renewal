import type { ReactNode } from 'react';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

import { SiteHeader } from '@/components/common/site-header';
import { JAPANESE_FONT_HREF, fontVariables } from '@/styles/fonts';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'YC Space',
  description: 'YC Space',
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html className={fontVariables} lang="en">
    <body className="antialiased">
      <link href={JAPANESE_FONT_HREF} precedence="default" rel="stylesheet" />
      <SiteHeader />
      <main className="site-main">{children}</main>
      <div className="common-background" />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
