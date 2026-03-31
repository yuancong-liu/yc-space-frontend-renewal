'use client';

import { useState } from 'react';

import { Monitor, Moon, Sun } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Theme = 'system' | 'light' | 'dark';

const THEME_OPTIONS: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

const ThemeRadio = () => {
  const [value, setValue] = useState<Theme>('system');

  return (
    <RadioGroup
      className="flex items-center gap-4"
      defaultValue="system"
      value={value}
      onValueChange={(v) => setValue(v as Theme)}
    >
      {THEME_OPTIONS.map(({ value: optionValue, label, icon: Icon }) => (
        <div key={optionValue} className="flex items-center gap-1.5">
          <RadioGroupItem
            id={`theme-${optionValue}`}
            value={optionValue}
          />
          <Label
            className="flex cursor-pointer items-center gap-1 text-text"
            htmlFor={`theme-${optionValue}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ThemeRadio;
