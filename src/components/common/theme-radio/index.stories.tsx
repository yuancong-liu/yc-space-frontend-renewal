import type { Meta, StoryObj } from '@storybook/react';

import ThemeRadio from './index';

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

export const OnLightBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-bg-1 text-text rounded-xl p-8">
        <Story />
      </div>
    ),
  ],
};

export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="rounded-xl p-8" style={{ backgroundColor: '#150640', color: '#fdfbf8' }}>
        <Story />
      </div>
    ),
  ],
};
