import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, type BoxProps, Surface, Text, Stack } from '@cre/web-ui';

const meta: Meta<BoxProps> = {
  title: 'Web/Primitives/Box',
  component: Box,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', description: 'HTML element or component to render', table: { defaultValue: { summary: "'div'" } } },
    className: { control: 'text', table: { defaultValue: { summary: '—' } } },
    style: { control: false },
    children: { control: false },
  },
  args: {
    as: 'div',
  },
};
export default meta;
type Story = StoryObj<BoxProps>;

export const Playground: Story = {
  render: (args) => (
    <Box
      {...args}
      style={{
        padding: 'var(--cre-space-micro)',
        border: '1px solid var(--cre-color-border)',
        borderRadius: 'var(--cre-radius-xsmall)',
        background: 'var(--cre-color-surface)',
      }}
    >
      <Text as="p">Box content</Text>
    </Box>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack gap="micro">
      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">as="div"</Text>
          <Box as="div" style={{ padding: 'var(--cre-space-nano)', border: '1px solid var(--cre-color-border)' }}>
            <Text as="p">Box rendered as div</Text>
          </Box>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">as="section"</Text>
          <Box as="section" style={{ padding: 'var(--cre-space-nano)', border: '1px solid var(--cre-color-border)' }}>
            <Text as="p">Box rendered as section</Text>
          </Box>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">as="article"</Text>
          <Box as="article" style={{ padding: 'var(--cre-space-nano)', border: '1px solid var(--cre-color-border)' }}>
            <Text as="p">Box rendered as article</Text>
          </Box>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">as="li" (in a ul)</Text>
          <ul style={{ margin: 0, paddingLeft: 'var(--cre-space-small)' }}>
            <Box as="li" style={{ padding: 'var(--cre-space-nano)', border: '1px solid var(--cre-color-border)', marginBottom: 'var(--cre-space-nano)' }}>
              <Text as="p">Box rendered as li</Text>
            </Box>
          </ul>
        </Stack>
      </Surface>
    </Stack>
  ),
};
