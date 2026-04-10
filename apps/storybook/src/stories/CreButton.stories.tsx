// Legacy story file — kept for historical reference.
// Active Button stories live in: web/components/Button/Button.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@cre/web-ui';

const meta: Meta<typeof Button> = {
  title: 'CRE Web UI/Button',
  component: Button,
  args: {
    children: 'CRE Button',
  },
  argTypes: {
    children: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};
