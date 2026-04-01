import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Grid, Surface, Stack, Text, Heading } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Grid',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

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

export const ResponsiveCards: Story = {
  render: () => (
    <Stack gap="micro">
      <Heading level={3}>Auto-fit grid</Heading>
      <Text as="p" tone="muted">Uses minItemWidth for a practical responsive layout.</Text>
      <Grid minItemWidth={240} gap="micro">
        <Card title="Users" body="1,248 active" />
        <Card title="Errors" body="7 in the last 24h" />
        <Card title="Latency" body="p95 220ms" />
        <Card title="Queue" body="14 pending" />
        <Card title="Deploy" body="Healthy" />
      </Grid>
    </Stack>
  )
};
