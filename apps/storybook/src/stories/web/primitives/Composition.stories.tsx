import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Box,
  Cluster,
  Container,
  Divider,
  Grid,
  Heading,
  Inline,
  ScrollArea,
  Stack,
  Surface,
  Text,
} from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/Composition',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Surface variant="raised">
      <Stack gap="nano">
        <Text as="p" variant="label" tone="muted">{label}</Text>
        <Heading level={4}>{value}</Heading>
      </Stack>
    </Surface>
  );
}

function ActionPill({ children }: { children: React.ReactNode }) {
  return (
    <Surface
      as="button"
      variant="subtle"
      padding="nano"
      radius="small"
      style={{
        cursor: 'pointer',
        background: 'var(--cre-color-surface)',
      }}
    >
      <Text as="span" variant="label">
        {children}
      </Text>
    </Surface>
  );
}

export const AdminShellExample: Story = {
  render: () => (
    <Box as="div" style={{ background: 'var(--cre-color-bg)', minHeight: '100vh' }}>
      <Surface variant="default" radius="none" style={{ borderLeft: 0, borderRight: 0, borderTop: 0 }}>
        <Container>
          <Inline align="center" justify="space-between" wrap gap="micro">
            <Stack gap="quark">
              <Heading level={3}>CRE Admin</Heading>
              <Text as="p" tone="muted">Backoffice layout composed from primitives</Text>
            </Stack>
            <Inline gap="nano" align="center" wrap>
              <ActionPill>New report</ActionPill>
              <ActionPill>Settings</ActionPill>
            </Inline>
          </Inline>
        </Container>
      </Surface>

      <Container>
        <Stack gap="micro" style={{ paddingTop: 'var(--cre-space-large)', paddingBottom: 'var(--cre-space-large)' }}>
          <Inline gap="micro" align="center" justify="space-between" wrap>
            <Text as="p" variant="label">Filters</Text>
            <Cluster gap="nano">
              <ActionPill>Last 7d</ActionPill>
              <ActionPill>Last 30d</ActionPill>
              <ActionPill>All time</ActionPill>
            </Cluster>
          </Inline>

          <Divider />

          <Grid minItemWidth={220} gap="micro">
            <StatCard label="Active users" value="1,248" />
            <StatCard label="Errors (24h)" value="7" />
            <StatCard label="Queue" value="14" />
            <StatCard label="p95 latency" value="220ms" />
          </Grid>

          <Surface padding="none" style={{ height: 260 }}>
            <ScrollArea style={{ height: '100%', padding: 'var(--cre-space-micro)' }}>
              <Stack gap="nano">
                <Heading level={4}>Recent activity</Heading>
                {Array.from({ length: 20 }).map((_, i) => (
                  <Surface key={i} variant="subtle" padding="nano">
                    <Inline gap="nano" align="center" justify="space-between" wrap>
                      <Text as="span">Event #{i + 1}</Text>
                      <Text as="span" tone="muted">just now</Text>
                    </Inline>
                  </Surface>
                ))}
              </Stack>
            </ScrollArea>
          </Surface>
        </Stack>
      </Container>
    </Box>
  )
};
