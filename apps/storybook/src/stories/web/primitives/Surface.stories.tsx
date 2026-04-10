import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Surface, type SurfaceProps, Stack, Text, Heading, Inline } from '@cre/web-ui';

const meta: Meta<SurfaceProps> = {
  title: 'Web/Primitives/Surface',
  component: Surface,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', table: { defaultValue: { summary: "'div'" } } },
    variant: { control: 'select', options: ['default','subtle','raised'], table: { defaultValue: { summary: "'default'" } } },
    padding: {
      control: 'select',
      options: ['none','quark','nano','pico','micro','tiny','small','medium','large'],
      table: { defaultValue: { summary: "'micro'" } },
    },
    radius: {
      control: 'select',
      options: ['none','xxsmall','xsmall','small','medium','large','xlarge','pill'],
      table: { defaultValue: { summary: "'small'" } },
    },
    border: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    children: { control: false },
    style: { control: false },
  },
  args: { variant: 'default', padding: 'micro', radius: 'small', border: true },
};
export default meta;
type Story = StoryObj<SurfaceProps>;

export const Playground: Story = {
  render: (args) => (
    <Surface {...args}>
      <Text as="p">Surface content</Text>
    </Surface>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack gap="large">
      <Stack gap="micro">
        <Text as="p" variant="label">Variants</Text>
        <Stack gap="nano">
          <Surface variant="default">
            <Text as="p">Default surface uses <code>--cre-color-surface</code></Text>
          </Surface>
          <Surface variant="subtle">
            <Text as="p">Subtle surface uses <code>--cre-color-bg</code></Text>
          </Surface>
          <Surface variant="raised">
            <Text as="p">Raised surface uses <code>--cre-color-surface-raised</code></Text>
          </Surface>
        </Stack>
      </Stack>

      <Stack gap="micro">
        <Text as="p" variant="label">Border</Text>
        <Inline gap="micro">
          <Surface border={true}>
            <Text as="p">With border</Text>
          </Surface>
          <Surface border={false}>
            <Text as="p">Without border</Text>
          </Surface>
        </Inline>
      </Stack>

      <Stack gap="micro">
        <Text as="p" variant="label">Radius</Text>
        <Stack gap="nano">
          <Surface radius="none">
            <Text as="p">radius="none"</Text>
          </Surface>
          <Surface radius="small">
            <Text as="p">radius="small"</Text>
          </Surface>
          <Surface radius="medium">
            <Text as="p">radius="medium"</Text>
          </Surface>
          <Surface radius="large">
            <Text as="p">radius="large"</Text>
          </Surface>
          <Surface radius="pill">
            <Text as="p">radius="pill"</Text>
          </Surface>
        </Stack>
      </Stack>
    </Stack>
  ),
};
