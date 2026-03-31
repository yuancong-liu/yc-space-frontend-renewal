import { ReactNode } from 'react';

type AboutMeLayoutProps = {
  children: ReactNode;
};

export default function AboutMeLayout({ children }: AboutMeLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
