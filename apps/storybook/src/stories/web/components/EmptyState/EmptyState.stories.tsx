import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EmptyState, Button, Stack } from '@cre/web-ui';

const meta: Meta<typeof EmptyState> = {
  title: 'Web/Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered', docs: { page: null } },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    actions: { control: false },
    className: { control: false },
    style: { control: false },
  },
  args: {
    title: 'Nothing here',
    description: 'This area can show guidance and an optional action.',
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Playground: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      actions={
        <Stack gap="nano">
          <Button>Primary action</Button>
        </Stack>
      }
    />
  ),
};

export const AllStates: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Stack gap="micro">
      <EmptyState title="Nothing here" description="No actions." />
      <EmptyState
        title="Nothing here"
        description="With a primary action."
        actions={
          <Stack gap="nano">
            <Button>Primary action</Button>
          </Stack>
        }
      />
    </Stack>
  ),
};

export const Basic: Story = {
  render: () => (
    <EmptyState
      title="Nothing here"
      description="This area can show guidance and an optional action."
      actions={
        <Stack gap="nano">
          <Button>Primary action</Button>
        </Stack>
      }
    />
  ),
};
