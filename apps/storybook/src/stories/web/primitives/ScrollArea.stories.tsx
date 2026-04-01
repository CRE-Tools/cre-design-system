import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollArea, Surface, Stack, Text, Heading } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/ScrollArea',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const Overflow: Story = {
  render: () => (
    <Stack gap="micro">
      <Heading level={3}>ScrollArea</Heading>
      <Text as="p" tone="muted">Minimal overflow container for panels/drawers/tables.</Text>

      <Surface padding="none" style={{ height: 240 }}>
        <ScrollArea style={{ height: '100%', padding: 'var(--cre-space-micro)' }}>
          <Stack gap="nano">
            {Array.from({ length: 30 }).map((_, i) => (
              <Text key={i} as="p">
                Row {i + 1} — Lorem ipsum dolor sit amet.
              </Text>
            ))}
          </Stack>
        </ScrollArea>
      </Surface>
    </Stack>
  )
};
