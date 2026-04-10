import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconSlot, type IconSlotProps, Inline, Stack, Surface, Text } from '@cre/web-ui';

const meta: Meta<IconSlotProps> = {
  title: 'Web/Primitives/IconSlot',
  component: IconSlot,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    size: { control: 'text', description: 'CSS length or custom property', table: { defaultValue: { summary: 'var(--cre-button-icon-size)' } } },
    padding: { control: 'text', description: 'CSS length or custom property', table: { defaultValue: { summary: 'var(--cre-button-icon-padding)' } } },
    className: { control: 'text', table: { defaultValue: { summary: '—' } } },
    style: { control: false },
    children: { control: false },
  },
  args: {
    size: 'var(--cre-button-icon-size)',
    padding: 'var(--cre-button-icon-padding)',
  },
};
export default meta;
type Story = StoryObj<IconSlotProps>;

const DotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="3" fill="currentColor" />
  </svg>
);

export const Playground: Story = {
  render: (args) => (
    <Inline gap="nano" align="center">
      <IconSlot {...args}>
        <DotIcon />
      </IconSlot>
      <Text as="span">Icon with label</Text>
    </Inline>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack gap="micro">
      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">Default size (button icon size)</Text>
          <Inline gap="nano" align="center">
            <IconSlot>
              <DotIcon />
            </IconSlot>
            <Text as="span">Default icon size</Text>
          </Inline>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">Large size (32px)</Text>
          <Inline gap="nano" align="center">
            <IconSlot size="32px" padding="var(--cre-space-nano)">
              <DotIcon />
            </IconSlot>
            <Text as="span">Large icon</Text>
          </Inline>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">Small size (16px)</Text>
          <Inline gap="nano" align="center">
            <IconSlot size="16px" padding="var(--cre-space-quark)">
              <DotIcon />
            </IconSlot>
            <Text as="span">Small icon</Text>
          </Inline>
        </Stack>
      </Surface>
    </Stack>
  ),
};
