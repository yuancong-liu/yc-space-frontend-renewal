import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('renders its children as a button', () => {
    render(<Button>Publish</Button>);

    expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Publish</Button>);

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick while disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Publish
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('merges caller class names over the variant classes', () => {
    render(<Button className='rounded-none'>Publish</Button>);

    expect(screen.getByRole('button', { name: 'Publish' })).toHaveClass(
      'rounded-none'
    );
  });
});
