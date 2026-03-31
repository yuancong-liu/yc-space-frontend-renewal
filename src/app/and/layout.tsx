import { ReactNode } from 'react';

type AndLayoutProps = {
  children: ReactNode;
};

export default function AndLayout({ children }: AndLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}
