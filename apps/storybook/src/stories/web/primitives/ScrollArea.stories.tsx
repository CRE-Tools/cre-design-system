import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ScrollArea, type ScrollAreaProps, Surface, Stack, Text, Heading, Grid } from '@cre/web-ui';

const meta: Meta<ScrollAreaProps> = {
  title: 'Web/Primitives/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', table: { defaultValue: { summary: "'div'" } } },
    className: { control: 'text', table: { defaultValue: { summary: '—' } } },
    style: { control: false },
    children: { control: false },
  },
  args: { as: 'div' },
};
export default meta;
type Story = StoryObj<ScrollAreaProps>;

export const Playground: Story = {
  render: (args) => (
    <Stack gap="micro">
      <Heading level={3}>ScrollArea</Heading>
      <Text as="p" tone="muted">Minimal overflow container for panels/drawers/tables.</Text>

      <Surface padding="none" style={{ height: 240 }}>
        <ScrollArea {...args} style={{ height: '100%', padding: 'var(--cre-space-micro)' }}>
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
  ),
};

export const AllStates: Story = {
  render: () => (
    <Grid columns={2} gap="micro">
      <Stack gap="nano">
        <Text as="p" variant="label">Vertical overflow (default)</Text>
        <Surface padding="none" style={{ height: 200 }}>
          <ScrollArea style={{ height: '100%', padding: 'var(--cre-space-micro)' }}>
            <Stack gap="nano">
              {Array.from({ length: 20 }).map((_, i) => (
                <Text key={i} as="p">
                  Row {i + 1} — Vertical scroll content
                </Text>
              ))}
            </Stack>
          </ScrollArea>
        </Surface>
      </Stack>

      <Stack gap="nano">
        <Text as="p" variant="label">Horizontal overflow</Text>
        <Surface padding="none" style={{ width: '100%', overflow: 'hidden' }}>
          <ScrollArea style={{ whiteSpace: 'nowrap', padding: 'var(--cre-space-micro)' }}>
            <Text as="p">
              This is a very long line of text that will overflow horizontally and require scrolling to read the entire content. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </ScrollArea>
        </Surface>
      </Stack>
    </Grid>
  ),
};
