import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import { EnvBanner } from '@/components/env-banner';
import { JAPANESE_FONT_HREF, fontVariables } from '@/styles/fonts';

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
      <link href={JAPANESE_FONT_HREF} precedence="default" rel="stylesheet" />
      <EnvBanner />
      {children}
      <div className="common-background" />
    </body>
  </html>
);

export default RootLayout;
