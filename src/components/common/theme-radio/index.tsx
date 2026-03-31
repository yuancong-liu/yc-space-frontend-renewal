'use client';

import { useState } from 'react';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type Theme = 'system' | 'light' | 'dark';

const THEME_OPTIONS: Array<{ value: Theme; label: string; icon: typeof SunIcon }> = [
  { value: 'system', label: 'System', icon: MonitorIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
];

const ThemeRadio = () => {
  const [value, setValue] = useState<Theme>('system');

  return (
    <fieldset className="flex items-center gap-4" role="radiogroup">
      <legend className="sr-only">Theme</legend>
      {/* Hidden native radio inputs for CSS :has() selector */}
      {THEME_OPTIONS.map(({ value: optionValue }) => (
        <input
          key={`native-${optionValue}`}
          checked={value === optionValue}
          className="sr-only"
          id={`theme-${optionValue}`}
          name="theme-native"
          type="radio"
          value={optionValue}
          onChange={() => setValue(optionValue)}
        />
      ))}
      {/* Visible theme buttons */}
      {THEME_OPTIONS.map(({ value: optionValue, label, icon: Icon }) => (
        <button
          key={optionValue}
          aria-checked={value === optionValue}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors',
            value === optionValue
              ? 'bg-accent-2 text-bg-1'
              : 'text-text hover:bg-bg-2'
          )}
          role="radio"
          type="button"
          onClick={() => setValue(optionValue)}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </fieldset>
  );
};

export default ThemeRadio;
