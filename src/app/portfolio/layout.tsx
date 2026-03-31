import { ReactNode } from 'react';

type PortfolioLayoutProps = {
  children: ReactNode;
};

export default function PortfolioLayout({ children }: PortfolioLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
