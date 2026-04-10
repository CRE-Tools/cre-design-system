import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Text } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Box',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => (
    <Box
      as="section"
      style={{
        padding: 'var(--cre-space-micro)',
        border: '1px solid var(--cre-color-border)',
        borderRadius: 'var(--cre-radius-xsmall)',
        background: 'var(--cre-color-surface)',
      }}
    >
      <Text as="p">Box is a minimal wrapper that forwards DOM props and supports an `as` prop.</Text>
    </Box>
  )
};
