import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ThemeRadio from '.';

describe('ThemeRadio', () => {
  it('renders all three theme radio buttons', () => {
    render(<ThemeRadio />);

    expect(screen.getByRole('radio', { name: /system/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /dark/i })).toBeInTheDocument();
  });

  it('has System selected by default', () => {
    render(<ThemeRadio />);

    expect(screen.getByRole('radio', { name: /system/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /light/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /dark/i })).toHaveAttribute('aria-checked', 'false');
  });

  it('switches selection when a button is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeRadio />);

    await user.click(screen.getByRole('radio', { name: /light/i }));

    expect(screen.getByRole('radio', { name: /light/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /system/i })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: /dark/i })).toHaveAttribute('aria-checked', 'false');
  });

  it('renders inside a fieldset with accessible sr-only legend', () => {
    render(<ThemeRadio />);

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('syncs hidden native radio inputs with button state', async () => {
    const user = userEvent.setup();
    render(<ThemeRadio />);

    await user.click(screen.getByRole('radio', { name: /dark/i }));

    const darkInput = document.getElementById('theme-dark') as HTMLInputElement;
    const systemInput = document.getElementById('theme-system') as HTMLInputElement;

    expect(darkInput.checked).toBe(true);
    expect(systemInput.checked).toBe(false);
  });
});
