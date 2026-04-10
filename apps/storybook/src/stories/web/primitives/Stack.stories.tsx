import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack, type StackProps, Surface, Text } from '@cre/web-ui';

const meta: Meta<StackProps> = {
  title: 'Web/Primitives/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    as: { control: 'text', table: { defaultValue: { summary: "'div'" } } },
    gap: {
      control: 'select',
      options: ['none','quark','nano','pico','micro','tiny','xxxsmall','xxsmall','xsmall','small','medium','large','xlarge','xxlarge','xxxlarge','huge','giant','titan'],
      table: { defaultValue: { summary: "'micro'" } },
    },
    align: { control: 'select', options: ['stretch','flex-start','flex-end','center','baseline'], table: { defaultValue: { summary: '—' } } },
    justify: { control: 'select', options: ['flex-start','flex-end','center','space-between','space-around','space-evenly'], table: { defaultValue: { summary: '—' } } },
    children: { control: false },
    style: { control: false },
  },
  args: { gap: 'micro' },
};
export default meta;
type Story = StoryObj<StackProps>;

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Surface>
        <Text as="p">Item 1</Text>
      </Surface>
      <Surface>
        <Text as="p">Item 2</Text>
      </Surface>
      <Surface>
        <Text as="p">Item 3</Text>
      </Surface>
    </Stack>
  ),
};

export const AllStates: Story = {
  render: () => (
    <Stack gap="large">
      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">gap="nano"</Text>
          <Stack gap="nano">
            <Surface variant="raised"><Text as="p">Item A</Text></Surface>
            <Surface variant="raised"><Text as="p">Item B</Text></Surface>
            <Surface variant="raised"><Text as="p">Item C</Text></Surface>
          </Stack>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">gap="micro"</Text>
          <Stack gap="micro">
            <Surface variant="raised"><Text as="p">Item A</Text></Surface>
            <Surface variant="raised"><Text as="p">Item B</Text></Surface>
            <Surface variant="raised"><Text as="p">Item C</Text></Surface>
          </Stack>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">gap="small"</Text>
          <Stack gap="small">
            <Surface variant="raised"><Text as="p">Item A</Text></Surface>
            <Surface variant="raised"><Text as="p">Item B</Text></Surface>
            <Surface variant="raised"><Text as="p">Item C</Text></Surface>
          </Stack>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="caption" tone="muted">gap="large"</Text>
          <Stack gap="large">
            <Surface variant="raised"><Text as="p">Item A</Text></Surface>
            <Surface variant="raised"><Text as="p">Item B</Text></Surface>
            <Surface variant="raised"><Text as="p">Item C</Text></Surface>
          </Stack>
        </Stack>
      </Surface>
    </Stack>
  ),
};
