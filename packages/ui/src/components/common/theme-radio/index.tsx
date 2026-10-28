'use client';

import type { MouseEvent } from 'react';
import { useState } from 'react';
import { flushSync } from 'react-dom';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '../../../lib/utils';

type Theme = 'system' | 'light' | 'dark';

const THEME_CYCLE: Theme[] = ['system', 'light', 'dark'];

const THEME_CONFIG: Record<Theme, { label: string; icon: typeof SunIcon }> = {
  system: { label: 'System', icon: MonitorIcon },
  light: { label: 'Light', icon: SunIcon },
  dark: { label: 'Dark', icon: MoonIcon },
};

const ICON_CROSSFADE = { duration: 0.3, ease: 'easeInOut' } as const;
const ICON_BLURRED = { filter: 'blur(6px)', opacity: 0 };
const ICON_SHARP = { filter: 'blur(0px)', opacity: 1 };

const VIEW_TRANSITION_DURATION = 450;
const VIEW_TRANSITION_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const ThemeRadio = () => {
  const [value, setValue] = useState<Theme>('system');

  const cycleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const index = THEME_CYCLE.indexOf(value);
    const nextValue = THEME_CYCLE[(index + 1) % THEME_CYCLE.length];
    const updateTheme = () => flushSync(() => setValue(nextValue));
    const supportsViewTransitions = 'startViewTransition' in document;
    const shouldReduceMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!supportsViewTransitions || shouldReduceMotion) {
      updateTheme();
      return;
    }

    const { bottom, left, right, top } = event.currentTarget.getBoundingClientRect();
    const originX = left + (right - left) / 2;
    const originY = top + (bottom - top) / 2;
    const radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY)
    );

    document.documentElement.dataset.themeReveal = 'true';

    try {
      const transition = document.startViewTransition(updateTheme);

      void transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${originX}px ${originY}px)`,
              `circle(${radius + 8}px at ${originX}px ${originY}px)`,
            ],
          },
          {
            duration: VIEW_TRANSITION_DURATION,
            easing: VIEW_TRANSITION_EASING,
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });

      void transition.finished.finally(() => {
        delete document.documentElement.dataset.themeReveal;
      });
    } catch {
      delete document.documentElement.dataset.themeReveal;
      updateTheme();
    }
  };

  const { label, icon: Icon } = THEME_CONFIG[value];

  return (
    <>
      {THEME_CYCLE.map(optionValue => (
        <input
          key={`native-${optionValue}`}
          readOnly
          checked={value === optionValue}
          className='sr-only'
          id={`theme-${optionValue}`}
          name='theme-native'
          type='radio'
          value={optionValue}
        />
      ))}
      <button
        aria-label={`Theme: ${label}`}
        className={cn(
          'relative size-10 cursor-pointer rounded-full',
          'text-text transition-colors hover:bg-bg-2'
        )}
        type='button'
        onClick={cycleTheme}
      >
        <AnimatePresence initial={false} mode='sync'>
          <motion.span
            key={value}
            aria-hidden
            animate={ICON_SHARP}
            className='absolute inset-0 flex items-center justify-center'
            exit={ICON_BLURRED}
            initial={ICON_BLURRED}
            transition={ICON_CROSSFADE}
          >
            <Icon className='h-5 w-5' />
          </motion.span>
        </AnimatePresence>
        <span className='sr-only'>{label}</span>
      </button>
    </>
  );
};
