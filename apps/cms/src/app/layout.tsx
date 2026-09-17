import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import { EnvBanner } from '@/components/env-banner';
import { fontVariables } from '@/styles/fonts';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'YC Space CMS',
  description: 'Content management for YC Space',
  robots: { index: false, follow: false },
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html className={fontVariables} lang="en">
    <body className="antialiased">
      <EnvBanner />
      {children}
      <div className="common-background" />
    </body>
  </html>
);

export default RootLayout;
