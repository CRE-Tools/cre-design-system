import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Divider, Inline, Stack, Surface, Text } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Divider',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const HorizontalAndVertical: Story = {
  render: () => (
    <Stack gap="micro">
      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="label">Horizontal</Text>
          <Divider />
          <Text as="p" tone="muted">Divider uses semantic border color.</Text>
        </Stack>
      </Surface>

      <Surface>
        <Text as="p" variant="label">Vertical</Text>
        <div style={{ height: 48 }}>
          <Inline gap="nano" align="center">
            <Text as="span">Left</Text>
            <Divider orientation="vertical" />
            <Text as="span">Right</Text>
          </Inline>
        </div>
      </Surface>
    </Stack>
  )
};
