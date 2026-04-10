import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Inline, Cluster, Surface, Text, Button, Divider } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Inline + Cluster',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

function Chip({ children }: { children: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: 'var(--cre-space-quark) var(--cre-space-nano)',
        borderRadius: 'var(--cre-radius-pill)',
        border: '1px solid var(--cre-color-border)',
        background: 'var(--cre-color-surface-raised)',
        color: 'var(--cre-color-text)',
        fontFamily: 'var(--cre-font-family-body)',
        fontSize: 'var(--cre-font-size-pico)',
      }}
    >
      {children}
    </span>
  );
}

export const Grouping: Story = {
  render: () => (
    <Surface>
      <Inline gap="micro" align="center" justify="space-between" wrap>
        <Text as="p" variant="label">Inline toolbar</Text>
        <Inline gap="nano" align="center" wrap>
          <Button size="regular">New</Button>
          <Button size="regular">Export</Button>
        </Inline>
      </Inline>
      <div style={{ margin: 'var(--cre-space-micro) 0' }}>
        <Divider />
      </div>
      <Text as="p" tone="muted">Cluster is optimized for wrapped groups like chips/tags.</Text>
      <div style={{ marginTop: 'var(--cre-space-nano)' }}>
        <Cluster gap="nano">
          <Chip>Open</Chip>
          <Chip>In progress</Chip>
          <Chip>Blocked</Chip>
          <Chip>Awaiting review</Chip>
          <Chip>Done</Chip>
        </Cluster>
      </div>
    </Surface>
  )
};
