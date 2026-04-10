import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Divider, type DividerProps, Inline, Stack, Surface, Text } from '@cre/web-ui';

const meta: Meta<DividerProps> = {
  title: 'Web/Primitives/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
    docs: { page: null },
  },
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal','vertical'], table: { defaultValue: { summary: "'horizontal'" } } },
    className: { control: 'text', table: { defaultValue: { summary: '—' } } },
    style: { control: false },
  },
  args: { orientation: 'horizontal' },
};
export default meta;
type Story = StoryObj<DividerProps>;

export const Playground: Story = {
  render: (args) => {
    if (args.orientation === 'vertical') {
      return (
        <div style={{ height: 48 }}>
          <Inline gap="nano" align="center">
            <Text as="span">Left</Text>
            <Divider {...args} />
            <Text as="span">Right</Text>
          </Inline>
        </div>
      );
    }
    return (
      <Stack gap="nano">
        <Text as="p">Content above</Text>
        <Divider {...args} />
        <Text as="p">Content below</Text>
      </Stack>
    );
  },
};

export const AllStates: Story = {
  render: () => (
    <Stack gap="micro">
      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="label">Horizontal</Text>
          <Divider />
          <Text as="p" tone="muted">Divider uses semantic border color.</Text>
        </Stack>
      </Surface>

      <Surface>
        <Stack gap="nano">
          <Text as="p" variant="label">Vertical</Text>
          <div style={{ height: 48 }}>
            <Inline gap="nano" align="center">
              <Text as="span">Left</Text>
              <Divider orientation="vertical" />
              <Text as="span">Right</Text>
            </Inline>
          </div>
        </Stack>
      </Surface>
    </Stack>
  ),
};
