import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Surface, Stack, Text, Heading } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Surface',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: () => (
    <Stack gap="micro">
      <Heading level={3}>Surface variants</Heading>
      <Surface variant="default">
        <Text as="p">Default surface uses <code>--cre-color-surface</code>.</Text>
      </Surface>
      <Surface variant="subtle">
        <Text as="p">Subtle surface uses <code>--cre-color-bg</code>.</Text>
      </Surface>
      <Surface variant="raised">
        <Text as="p">Raised surface uses <code>--cre-color-surface-raised</code>.</Text>
      </Surface>
    </Stack>
  )
};
