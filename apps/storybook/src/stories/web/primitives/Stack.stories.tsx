import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack, Surface, Text, Button } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Stack',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const SpacingAndAlignment: Story = {
  render: () => (
    <Stack gap="small" align="stretch">
      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="label">Default stack</Text>
          <Text as="p" tone="muted">Vertical flex layout with token-driven gap.</Text>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano" align="flex-start">
          <Text as="p" variant="label">Actions</Text>
          <Stack gap="nano" align="flex-start">
            <Button size="regular">Primary</Button>
            <Button size="regular">Secondary</Button>
          </Stack>
        </Stack>
      </Surface>
    </Stack>
  )
};
