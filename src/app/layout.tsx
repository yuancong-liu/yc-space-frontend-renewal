import type { ReactNode } from 'react';

import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';

import ThemeRadio from '@/components/common/theme-radio';

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
  title: 'YC Space',
  description: 'YC Space',
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
      <ThemeRadio />
      {children}
      <div className="common-background" />
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
