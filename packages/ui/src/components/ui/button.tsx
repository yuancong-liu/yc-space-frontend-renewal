import type { ComponentProps } from 'react';

import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full',
    'text-sm font-medium whitespace-nowrap transition-colors',
    'focus-visible:ring-2 focus-visible:ring-accent-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1 focus-visible:outline-none',
    'disabled:pointer-events-none disabled:opacity-50'
  ),
  {
    variants: {
      variant: {
        primary: 'bg-accent-2 text-bg-1 hover:bg-accent-1',
        outline:
          'border border-accent-2 text-text hover:bg-bg-2 hover:text-accent-2',
        ghost: 'text-text hover:bg-bg-2',
      },
      size: {
        sm: 'h-9 px-4',
        md: 'h-11 px-6',
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

export const Button = ({ className, size, variant, ...props }: ButtonProps) => (
  <button
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
);
