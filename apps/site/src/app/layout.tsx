import type { ReactNode } from 'react';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

import { SiteHeader } from '@/components/common/site-header';
import { fontVariables } from '@/styles/fonts';

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
      <SiteHeader />
      <main className="site-main">{children}</main>
      <div className="common-background" />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
