import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Drawer, Button, Stack, Text, Inline } from '@cre/web-ui';

const meta: Meta<typeof Drawer> = {
  title: 'Web/Components/Drawer',
  component: Drawer,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    open: { control: false },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    side: { control: 'radio', options: ['right', 'left'] },
    motion: { control: 'radio', options: ['slide', 'pop'] },
    children: { control: false },
    footer: { control: false },
    onClose: { action: 'closed' },
    className: { control: false },
  },
  args: {
    title: 'Drawer title',
    dismissible: true,
    side: 'right',
    motion: 'slide',
  },
};

export default meta;

type Story = StoryObj<typeof Drawer>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          {...args}
          open={open}
          onClose={() => {
            args.onClose?.();
            setOpen(false);
          }}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Use Drawer for detail panels, editors, or filters.</Text>
            {Array.from({ length: 8 }).map((_, i) => (
              <Text as="p" key={i} tone={i % 2 === 0 ? 'muted' : 'default'}>
                Scrollable content row {i + 1}
              </Text>
            ))}
          </Stack>
        </Drawer>
      </>
    );
  },
};

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          title="Drawer title"
          onClose={() => setOpen(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Use Drawer for detail panels, editors, or filters.</Text>
            {Array.from({ length: 20 }).map((_, i) => (
              <Text as="p" key={i} tone={i % 2 === 0 ? 'muted' : 'default'}>
                Scrollable content row {i + 1}
              </Text>
            ))}
          </Stack>
        </Drawer>
      </>
    );
  },
};

export const LeftSide: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open left drawer</Button>
        <Drawer
          open={open}
          side="left"
          title="Left drawer"
          onClose={() => setOpen(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Drawer can slide from the left or right.</Text>
          </Stack>
        </Drawer>
      </>
    );
  },
};

export const PopMotion: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open pop drawer</Button>
        <Drawer
          open={open}
          motion="pop"
          title="Pop motion"
          onClose={() => setOpen(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Pop motion is useful for lighter overlays.</Text>
          </Stack>
        </Drawer>
      </>
    );
  },
};
