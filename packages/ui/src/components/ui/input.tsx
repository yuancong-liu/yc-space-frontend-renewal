import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils';

export const Input = ({ className, ...props }: ComponentProps<'input'>) => (
  <input
    className={cn(
      'flex h-11 w-full rounded-full border border-bg-2 bg-bg-1 px-4 text-sm text-text',
      'placeholder:text-text/50',
      'focus-visible:border-accent-2 focus-visible:ring-2 focus-visible:ring-accent-2 focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
);
