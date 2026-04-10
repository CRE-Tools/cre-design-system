import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Container, type ContainerProps, Surface, Stack, Heading, Text } from '@cre/web-ui';

const meta: Meta<ContainerProps> = {
  title: 'Web/Primitives/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', table: { defaultValue: { summary: "'div'" } } },
    size: { control: 'select', options: ['read','focu','seco','main','full'], table: { defaultValue: { summary: "'main'" } } },
    paddingX: {
      control: 'select',
      options: ['none','quark','nano','pico','micro','tiny','small','medium','large'],
      table: { defaultValue: { summary: "'micro'" } },
    },
    children: { control: false },
    style: { control: false },
  },
  args: { size: 'main', paddingX: 'micro' },
};
export default meta;
type Story = StoryObj<ContainerProps>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ background: 'var(--cre-color-bg)', minHeight: '200px' }}>
      <Container {...args}>
        <Surface>
          <Text as="p">Container content with constrained max-width</Text>
        </Surface>
      </Container>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ background: 'var(--cre-color-bg)', minHeight: '100vh', paddingTop: 'var(--cre-space-large)' }}>
      <Stack gap="large">
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">size="read"</Text>
          <Container size="read">
            <Surface style={{ width: '100%' }}>
              <Text as="p">Read container (narrow, optimized for reading)</Text>
            </Surface>
          </Container>
        </Stack>

        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">size="focu"</Text>
          <Container size="focu">
            <Surface style={{ width: '100%' }}>
              <Text as="p">Focu container (focused content)</Text>
            </Surface>
          </Container>
        </Stack>

        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">size="seco"</Text>
          <Container size="seco">
            <Surface style={{ width: '100%' }}>
              <Text as="p">Seco container (secondary content)</Text>
            </Surface>
          </Container>
        </Stack>

        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">size="main"</Text>
          <Container size="main">
            <Surface style={{ width: '100%' }}>
              <Text as="p">Main container (primary layout)</Text>
            </Surface>
          </Container>
        </Stack>

        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">size="full"</Text>
          <Container size="full">
            <Surface style={{ width: '100%' }}>
              <Text as="p">Full container (no max-width constraint)</Text>
            </Surface>
          </Container>
        </Stack>
      </Stack>
    </div>
  ),
};
