import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PostToc } from '.';

const renderWithHeadings = () => {
  document.body.innerHTML = `
    <article class="post-content">
      <div class="yc-markdown">
        <h2 id="first-section">First section</h2>
        <h3 id="details">Details</h3>
      </div>
    </article>
  `;

  return render(<PostToc />);
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PostToc', () => {
  it('links to the rendered markdown heading ids', async () => {
    renderWithHeadings();

    await waitFor(() => {
      expect(
        screen.getByRole('navigation', { name: 'On this page' })
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'First section' })).toHaveAttribute(
      'href',
      '#first-section'
    );
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'data-level',
      '3'
    );
  });

  it('does not render when the post has no headings', async () => {
    const { container } = render(<PostToc />);

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });
});
