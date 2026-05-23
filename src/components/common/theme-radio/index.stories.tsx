import type { Meta, StoryObj } from '@storybook/react';

import ThemeRadio from '.';

const meta = {
  title: 'Common/ThemeRadio',
  component: ThemeRadio,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemeRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <header className="site-header">
        <Story />
      </header>
    ),
  ],
};
