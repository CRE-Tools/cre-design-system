import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EmptyState, Button, Stack } from '@cre/web-ui';

const meta: Meta<typeof EmptyState> = {
  title: 'Web/Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

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
