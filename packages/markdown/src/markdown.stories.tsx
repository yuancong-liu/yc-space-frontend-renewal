import type { Meta, StoryObj } from '@storybook/react';

import { Markdown } from './markdown';
import { SAMPLE_POST } from './sample';

const meta = {
  title: 'Markdown/Markdown',
  component: Markdown,
  parameters: {
    layout: 'padded',
  },
  args: {
    source: SAMPLE_POST,
  },
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPost: Story = {};

export const Prose: Story = {
  args: {
    source: [
      '## Heading two',
      '',
      'A paragraph with **weight**, *italics*, `inline code` and an',
      '[external link](https://example.com).',
      '',
      '### Heading three',
      '',
      '> A blockquote.',
    ].join('\n'),
  },
};

export const Code: Story = {
  args: {
    source: ['```tsx', 'export const App = () => <h1>Hi</h1>;', '```'].join(
      '\n'
    ),
  },
};

export const UnknownDirective: Story = {
  args: {
    source: '::sandbox{name="not-registered-yet"}',
  },
};
