import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Heading, Stack, Surface, Text } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Text + Heading',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const Typography: Story = {
  render: () => (
    <Surface>
      <Stack gap="micro">
        <Heading level={2}>Heading level 2</Heading>
        <Text as="p" tone="muted">Body text uses token-backed font-family and font-size vars.</Text>

        <Heading level={4}>Section</Heading>
        <Text as="p">
          This is body text. Use <code>tone</code> for muted/subtle variants.
        </Text>

        <Text as="p" variant="caption" tone="subtle">
          Caption text (pico size) for helper content.
        </Text>

        <Text as="p" variant="label">
          Label text (micro size + 600 weight) for small headings in surfaces.
        </Text>
      </Stack>
    </Surface>
  )
};
