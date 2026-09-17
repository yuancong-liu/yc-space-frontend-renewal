import type { ReactNode } from 'react';

import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';

import { EnvBanner } from '@/components/env-banner';

import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'YC Space CMS',
  description: 'Content management for YC Space',
  robots: { index: false, follow: false },
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body
      className={clsx(
        geistSans.variable,
        jetBrainsMono.variable,
        'antialiased'
      )}
    >
      <EnvBanner />
      {children}
      <div className="common-background" />
    </body>
  </html>
);

export default RootLayout;
