import type { ComponentProps } from 'react';

const isExternal = (href: string | undefined) =>
  !!href && /^https?:\/\//.test(href);

export const PostLink = ({ children, href, ...props }: ComponentProps<'a'>) =>
  isExternal(href) ? (
    <a
      data-external
      href={href}
      rel='noopener noreferrer'
      target='_blank'
      {...props}
    >
      {children}
    </a>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
