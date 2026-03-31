'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

const THEME_OPTIONS: Theme[] = ['system', 'light', 'dark'];

const ThemeRadio = () => {
  const [value, setValue] = useState<Theme>('system');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value as Theme);
  };

  return (
    <fieldset className="flex items-center gap-4">
      <legend className="sr-only">Theme</legend>
      {THEME_OPTIONS.map((theme) => (
        <label
          key={theme}
          className="flex cursor-pointer items-center gap-1.5 text-sm capitalize text-text"
          htmlFor={`theme-${theme}`}
        >
          <input
            checked={value === theme}
            className="accent-accent-2"
            id={`theme-${theme}`}
            name="theme"
            type="radio"
            value={theme}
            onChange={handleChange}
          />
          {theme}
        </label>
      ))}
    </fieldset>
  );
};

export default ThemeRadio;
