import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Inline, type InlineProps, Cluster, Surface, Text, Stack, Divider } from '@cre/web-ui';

const meta: Meta<InlineProps> = {
  title: 'Web/Primitives/Inline + Cluster',
  component: Inline,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', table: { defaultValue: { summary: "'div'" } } },
    gap: {
      control: 'select',
      options: ['none','quark','nano','pico','micro','tiny','xxxsmall','xxsmall','xsmall','small','medium','large'],
      table: { defaultValue: { summary: "'micro'" } },
    },
    align: { control: 'select', options: ['stretch','flex-start','flex-end','center','baseline'], table: { defaultValue: { summary: '—' } } },
    justify: { control: 'select', options: ['flex-start','flex-end','center','space-between','space-around'], table: { defaultValue: { summary: '—' } } },
    wrap: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    children: { control: false },
    style: { control: false },
  },
  args: { gap: 'micro', align: 'center' },
};
export default meta;
type Story = StoryObj<InlineProps>;

export const Playground: Story = {
  render: (args) => (
    <Inline {...args}>
      <Surface padding="nano">
        <Text as="span">A</Text>
      </Surface>
      <Surface padding="nano">
        <Text as="span">B</Text>
      </Surface>
      <Surface padding="nano">
        <Text as="span">C</Text>
      </Surface>
    </Inline>
  ),
};

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

export const AllStates: Story = {
  render: () => (
    <Surface>
      <Stack gap="micro">
        <Stack gap="nano">
          <Text as="p" variant="label">Inline toolbar</Text>
          <Inline gap="micro" align="center" justify="space-between" wrap>
            <Text as="p" tone="muted">Inline layout with alignment</Text>
            <Inline gap="nano" align="center" wrap>
              <Surface padding="nano" variant="raised">
                <Text as="span">New</Text>
              </Surface>
              <Surface padding="nano" variant="raised">
                <Text as="span">Export</Text>
              </Surface>
            </Inline>
          </Inline>
        </Stack>

        <Divider />

        <Stack gap="nano">
          <Text as="p" variant="label">Cluster wrapping</Text>
          <Text as="p" tone="muted">Cluster is optimized for wrapped groups like chips/tags.</Text>
          <Cluster gap="nano">
            <Chip>Open</Chip>
            <Chip>In progress</Chip>
            <Chip>Blocked</Chip>
            <Chip>Awaiting review</Chip>
            <Chip>Done</Chip>
          </Cluster>
        </Stack>
      </Stack>
    </Surface>
  ),
};
