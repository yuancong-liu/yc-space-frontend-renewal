import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ThemeRadio from '.';

describe('ThemeRadio', () => {
  it('renders a theme cycle button defaulting to System', () => {
    render(<ThemeRadio />);

    expect(screen.getByRole('button', { name: /theme: system/i })).toBeInTheDocument();
    expect(screen.getByText('System')).toHaveClass('sr-only');
  });

  it('cycles system → light → dark → system on click', async () => {
    const user = userEvent.setup();
    render(<ThemeRadio />);

    const button = screen.getByRole('button', { name: /theme:/i });

    await user.click(button);
    expect(button).toHaveAccessibleName(/theme: light/i);

    await user.click(button);
    expect(button).toHaveAccessibleName(/theme: dark/i);

    await user.click(button);
    expect(button).toHaveAccessibleName(/theme: system/i);
  });

  it('syncs hidden native radio inputs with button state', async () => {
    const user = userEvent.setup();
    render(<ThemeRadio />);

    await user.click(screen.getByRole('button', { name: /theme:/i }));
    await user.click(screen.getByRole('button', { name: /theme:/i }));

    const darkInput = document.getElementById('theme-dark') as HTMLInputElement;
    const systemInput = document.getElementById('theme-system') as HTMLInputElement;

    expect(darkInput.checked).toBe(true);
    expect(systemInput.checked).toBe(false);
  });
});
