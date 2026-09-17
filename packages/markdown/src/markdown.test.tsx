import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Markdown } from './markdown';

const renderSource = (source: string) => {
  const { container } = render(<Markdown source={source} />);

  return container.querySelector('.yc-markdown') as HTMLElement;
};

describe('Markdown', () => {
  it('renders CommonMark structure', () => {
    const root = renderSource('## Title\n\nSome *emphasis* and **weight**.');

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(root.querySelector('em')).toHaveTextContent('emphasis');
    expect(root.querySelector('strong')).toHaveTextContent('weight');
  });

  it('gives headings slugged ids so they can be linked', () => {
    const root = renderSource('## Hello World');

    expect(root.querySelector('h2')).toHaveAttribute('id', 'hello-world');
  });

  it('supports GFM tables, strikethrough and task lists', () => {
    const root = renderSource(
      ['| a | b |', '| - | - |', '| 1 | 2 |', '', '~~gone~~', '', '- [x] done']
        .join('\n')
    );

    expect(root.querySelector('table')).toBeInTheDocument();
    expect(root.querySelector('del')).toHaveTextContent('gone');
    expect(root.querySelector('input[type="checkbox"]')).toBeChecked();
  });

  it('renders an image inside a sentence as a bare img', () => {
    const root = renderSource('Text ![A cat](/cat.png) more text.');

    // A <figure> is not allowed inside a <p>; the browser would close the
    // paragraph early and hydration would mismatch.
    expect(root.querySelector('figure')).not.toBeInTheDocument();
    expect(root.querySelector('p img')).toBeInTheDocument();
  });

  it('opens external links in a new tab and marks them', () => {
    const root = renderSource('[out](https://example.com) and [in](/blog)');

    const external = root.querySelector('a[href="https://example.com"]');
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    expect(external).toHaveAttribute('data-external');

    const internal = root.querySelector('a[href="/blog"]');
    expect(internal).not.toHaveAttribute('target');
  });

  it('wraps images in a figure and uses the alt text as a caption', () => {
    const root = renderSource('![A cat](/cat.png)');

    // A figure inside a <p> is invalid HTML and breaks hydration, so the
    // paragraph is demoted to a plain wrapper.
    expect(root.querySelector('p')).not.toBeInTheDocument();
    expect(root.querySelector('.yc-figure-block > figure')).toBeInTheDocument();
    expect(root.querySelector('figcaption')).toHaveTextContent('A cat');
    expect(screen.getByRole('img', { name: 'A cat' })).toHaveAttribute(
      'loading',
      'lazy'
    );
  });

  it('highlights fenced code and labels the block with its language', () => {
    const root = renderSource('```ts\nconst answer = 42;\n```');

    expect(root.querySelector('.yc-code-block-language')).toHaveTextContent(
      'ts'
    );
    expect(root.querySelector('code .hljs-keyword')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Copy code' })
    ).toBeInTheDocument();
  });

  it('leaves a fence without a language unhighlighted', () => {
    const root = renderSource('```\njust text\n```');

    expect(root.querySelector('.yc-code-block-language')).toHaveTextContent(
      'text'
    );
    expect(root.querySelector('pre')).toHaveTextContent('just text');
  });

  it('drops raw HTML instead of rendering it', () => {
    const root = renderSource('<script>alert(1)</script>\n\nafter');

    expect(root.querySelector('script')).not.toBeInTheDocument();
    expect(root).toHaveTextContent('after');
  });
});

describe('Markdown directives', () => {
  it('renders ::frame as an embedded iframe', () => {
    const root = renderSource(
      '::frame{src="https://codepen.io/x/embed/abc" title="Subgrid" height=500}'
    );

    const frame = root.querySelector('.yc-frame');
    expect(frame).toBeInTheDocument();
    expect(frame).toHaveStyle({ '--frame-height': '500px' });

    const iframe = screen.getByTitle('Subgrid');
    expect(iframe).toHaveAttribute('src', 'https://codepen.io/x/embed/abc');
    expect(iframe).toHaveAttribute('loading', 'lazy');
  });

  it('refuses a non-https embed src', () => {
    const root = renderSource('::frame{src="javascript:alert(1)"}');

    expect(root.querySelector('iframe')).not.toBeInTheDocument();
    expect(root.querySelector('.yc-markdown-error')).toBeInTheDocument();
  });

  it('surfaces an unknown directive instead of dropping it', () => {
    const root = renderSource('::sandbox{name="nope"}');

    expect(root.querySelector('.yc-markdown-error')).toHaveTextContent(
      '::sandbox'
    );
  });

  it.each([
    ['a ratio', 'Ratio is 16:10 here.'],
    ['a time', 'Ship it at 12:30 sharp.'],
    ['a word after a colon', 'See note:this for details.'],
  ])('leaves %s in prose untouched', (_case, source) => {
    const root = renderSource(source);

    expect(root).toHaveTextContent(source);
    expect(root.querySelector('.yc-markdown-error')).not.toBeInTheDocument();
    // One text node, not three — the restored directive is merged back in.
    expect(root.querySelector('p')?.childNodes).toHaveLength(1);
  });
});
