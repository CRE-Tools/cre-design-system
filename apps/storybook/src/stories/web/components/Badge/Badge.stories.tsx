import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge, Inline } from '@cre/web-ui';

const meta: Meta<typeof Badge> = {
  title: 'Web/Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  render: () => (
    <Inline gap="nano" wrap>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="accent">Accent</Badge>
    </Inline>
  ),
};
