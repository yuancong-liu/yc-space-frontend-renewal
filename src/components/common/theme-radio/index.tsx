'use client';

import { useState } from 'react';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

type Theme = 'system' | 'light' | 'dark';

const THEME_CYCLE: Theme[] = ['system', 'light', 'dark'];

const THEME_CONFIG: Record<
  Theme,
  { label: string; icon: typeof SunIcon }
> = {
  system: { label: 'System', icon: MonitorIcon },
  light: { label: 'Light', icon: SunIcon },
  dark: { label: 'Dark', icon: MoonIcon },
};

const ICON_CROSSFADE = { duration: 0.3, ease: 'easeInOut' } as const;

const ICON_BLURRED = { filter: 'blur(6px)', opacity: 0 };
const ICON_SHARP = { filter: 'blur(0px)', opacity: 1 };

export const ThemeRadio = () => {
  const [value, setValue] = useState<Theme>('system');

  const cycleTheme = () => {
    const index = THEME_CYCLE.indexOf(value);
    setValue(THEME_CYCLE[(index + 1) % THEME_CYCLE.length]);
  };

  const { label, icon: Icon } = THEME_CONFIG[value];

  return (
    <>
      {THEME_CYCLE.map((optionValue) => (
        <input
          key={`native-${optionValue}`}
          readOnly
          checked={value === optionValue}
          className="sr-only"
          id={`theme-${optionValue}`}
          name="theme-native"
          type="radio"
          value={optionValue}
        />
      ))}
      <button
        aria-label={`Theme: ${label}`}
        className={cn(
          'relative size-10 cursor-pointer rounded-full',
          'text-text transition-colors hover:bg-bg-2'
        )}
        type="button"
        onClick={cycleTheme}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.span
            key={value}
            aria-hidden
            animate={ICON_SHARP}
            className="absolute inset-0 flex items-center justify-center"
            exit={ICON_BLURRED}
            initial={ICON_BLURRED}
            transition={ICON_CROSSFADE}
          >
            <Icon className="h-5 w-5" />
          </motion.span>
        </AnimatePresence>
        <span className="sr-only">{label}</span>
      </button>
    </>
  );
};
