import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Publish',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Sizes: Story = {
  render: args => (
    <div className='flex items-center gap-3'>
      <Button {...args} size='sm' />
      <Button {...args} size='md' />
      <Button {...args} size='lg' />
    </div>
  ),
};
