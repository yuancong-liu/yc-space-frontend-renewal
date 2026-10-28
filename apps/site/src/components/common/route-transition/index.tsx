'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { motion, useReducedMotion } from 'motion/react';
import type { Variants } from 'motion/react';
import { usePathname } from 'next/navigation';

type RouteTransitionProps = {
  children: ReactNode;
};

const routeVariants: Variants = {
  enter: {
    opacity: 1,
    transition: { duration: 0.16, ease: 'easeOut' },
    y: 0,
  },
  initial: { opacity: 0.96, y: 3 },
};

export const RouteTransition = ({ children }: RouteTransitionProps) => {
  const hasMounted = useRef(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = hasMounted.current && !shouldReduceMotion;

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  return (
    <motion.div
      key={pathname}
      animate='enter'
      className='route-transition'
      initial={shouldAnimate ? 'initial' : false}
      variants={routeVariants}
    >
      {children}
    </motion.div>
  );
};
