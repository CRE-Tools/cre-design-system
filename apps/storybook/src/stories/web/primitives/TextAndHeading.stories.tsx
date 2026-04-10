import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Heading, Stack, Surface, Text, type TextProps } from '@cre/web-ui';

const meta: Meta<TextProps> = {
  title: 'Web/Primitives/Text + Heading',
  component: Text,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', table: { defaultValue: { summary: "'span'" } } },
    variant: { control: 'select', options: ['body','caption','label'], table: { defaultValue: { summary: "'body'" } } },
    tone: { control: 'select', options: ['default','muted','subtle'], table: { defaultValue: { summary: "'default'" } } },
    children: { control: 'text', table: { defaultValue: { summary: '—' } } },
    style: { control: false },
  },
  args: { variant: 'body', tone: 'default', children: 'Sample text' },
};
export default meta;
type Story = StoryObj<TextProps>;

export const Playground: Story = {
  render: (args) => <Text {...args} />,
};

export const AllStates: Story = {
  render: () => (
    <Surface>
      <Stack gap="large">
        <Stack gap="micro">
          <Text as="p" variant="caption" tone="muted">Text variants</Text>
          <Stack gap="nano">
            <Text as="p" variant="body">Body text (default variant)</Text>
            <Text as="p" variant="caption">Caption text (pico size)</Text>
            <Text as="p" variant="label">Label text (micro size + 600 weight)</Text>
          </Stack>
        </Stack>

        <Stack gap="micro">
          <Text as="p" variant="caption" tone="muted">Text tones</Text>
          <Stack gap="nano">
            <Text as="p" tone="default">Default tone</Text>
            <Text as="p" tone="muted">Muted tone</Text>
            <Text as="p" tone="subtle">Subtle tone</Text>
          </Stack>
        </Stack>

        <Stack gap="micro">
          <Text as="p" variant="caption" tone="muted">Heading levels</Text>
          <Stack gap="nano">
            <Heading level={1}>Heading level 1</Heading>
            <Heading level={2}>Heading level 2</Heading>
            <Heading level={3}>Heading level 3</Heading>
            <Heading level={4}>Heading level 4</Heading>
            <Heading level={5}>Heading level 5</Heading>
            <Heading level={6}>Heading level 6</Heading>
          </Stack>
        </Stack>
      </Stack>
    </Surface>
  ),
};
