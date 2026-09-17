import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SiteHeader } from '.';

describe('SiteHeader', () => {
  it('renders the shared theme toggle inside a banner', () => {
    render(<SiteHeader />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /theme: system/i })
    ).toBeInTheDocument();
  });
});
