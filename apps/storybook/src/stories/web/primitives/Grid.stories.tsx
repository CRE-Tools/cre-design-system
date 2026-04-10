import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Grid, type GridProps, Surface, Stack, Text, Heading } from '@cre/web-ui';

const meta: Meta<GridProps> = {
  title: 'Web/Primitives/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', table: { defaultValue: { summary: "'div'" } } },
    columns: { control: 'number', table: { defaultValue: { summary: '—' } } },
    minItemWidth: { control: 'text', description: 'Number (px) or CSS string — enables auto-fit mode', table: { defaultValue: { summary: '—' } } },
    gap: {
      control: 'select',
      options: ['none','quark','nano','pico','micro','tiny','small','medium','large'],
      table: { defaultValue: { summary: "'micro'" } },
    },
    align: { control: 'select', options: ['stretch','start','end','center'], table: { defaultValue: { summary: '—' } } },
    justify: { control: 'select', options: ['stretch','start','end','center'], table: { defaultValue: { summary: '—' } } },
    children: { control: false },
    style: { control: false },
  },
  args: { columns: 3, gap: 'micro' },
};
export default meta;
type Story = StoryObj<GridProps>;

export const Playground: Story = {
  render: (args) => (
    <Grid {...args}>
      <Surface>
        <Text as="p">Cell 1</Text>
      </Surface>
      <Surface>
        <Text as="p">Cell 2</Text>
      </Surface>
      <Surface>
        <Text as="p">Cell 3</Text>
      </Surface>
      <Surface>
        <Text as="p">Cell 4</Text>
      </Surface>
      <Surface>
        <Text as="p">Cell 5</Text>
      </Surface>
      <Surface>
        <Text as="p">Cell 6</Text>
      </Surface>
    </Grid>
  ),
};

function Card({ title, body }: { title: string; body: string }) {
  return (
    <Surface variant="raised" padding="micro">
      <Stack gap="nano">
        <Text as="p" variant="label">{title}</Text>
        <Text as="p" tone="muted">{body}</Text>
      </Stack>
    </Surface>
  );
}

export const AllStates: Story = {
  render: () => (
    <Stack gap="large">
      <Stack gap="micro">
        <Text as="p" variant="label">Auto-fit mode (minItemWidth)</Text>
        <Text as="p" tone="muted">Uses minItemWidth for a practical responsive layout.</Text>
        <Grid minItemWidth={240} gap="micro">
          <Card title="Users" body="1,248 active" />
          <Card title="Errors" body="7 in the last 24h" />
          <Card title="Latency" body="p95 220ms" />
          <Card title="Queue" body="14 pending" />
          <Card title="Deploy" body="Healthy" />
        </Grid>
      </Stack>

      <Stack gap="micro">
        <Text as="p" variant="label">Fixed columns mode (columns=3)</Text>
        <Text as="p" tone="muted">Fixed 3-column grid layout.</Text>
        <Grid columns={3} gap="micro">
          <Surface variant="raised"><Text as="p">Cell 1</Text></Surface>
          <Surface variant="raised"><Text as="p">Cell 2</Text></Surface>
          <Surface variant="raised"><Text as="p">Cell 3</Text></Surface>
          <Surface variant="raised"><Text as="p">Cell 4</Text></Surface>
          <Surface variant="raised"><Text as="p">Cell 5</Text></Surface>
          <Surface variant="raised"><Text as="p">Cell 6</Text></Surface>
        </Grid>
      </Stack>
    </Stack>
  ),
};
