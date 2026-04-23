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

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const [openRight, setOpenRight] = useState(false);
    const [openLeft, setOpenLeft] = useState(false);
    const [openPop, setOpenPop] = useState(false);

    return (
      <Stack gap="micro">
        <Inline gap="nano" wrap>
          <Button onClick={() => setOpenRight(true)}>Open right / slide</Button>
          <Button onClick={() => setOpenLeft(true)}>Open left / slide</Button>
          <Button onClick={() => setOpenPop(true)}>Open right / pop</Button>
        </Inline>

        <Drawer
          open={openRight}
          side="right"
          motion="slide"
          title="Right / Slide"
          onClose={() => setOpenRight(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpenRight(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Right-side drawer with slide motion.</Text>
          </Stack>
        </Drawer>

        <Drawer
          open={openLeft}
          side="left"
          motion="slide"
          title="Left / Slide"
          onClose={() => setOpenLeft(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpenLeft(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Left-side drawer with slide motion.</Text>
          </Stack>
        </Drawer>

        <Drawer
          open={openPop}
          side="right"
          motion="pop"
          title="Right / Pop"
          onClose={() => setOpenPop(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpenPop(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Right-side drawer with pop motion.</Text>
          </Stack>
        </Drawer>
      </Stack>
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
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open drawer</Button>
  <Drawer
    open={open}
    title="Drawer title"
    onClose={() => setOpen(false)}
    footer={
      <Inline gap="nano" justify="flex-end">
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Inline>
    }
  >
    <Text as="p">Drawer content goes here.</Text>
  </Drawer>
</>
        `.trim(),
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open left drawer</Button>
  <Drawer
    open={open}
    side="left"
    title="Left drawer"
    onClose={() => setOpen(false)}
    footer={
      <Inline gap="nano" justify="flex-end">
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Inline>
    }
  >
    <Text as="p">Drawer content goes here.</Text>
  </Drawer>
</>
        `.trim(),
      },
    },
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
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open pop drawer</Button>
  <Drawer
    open={open}
    motion="pop"
    title="Pop motion"
    onClose={() => setOpen(false)}
    footer={
      <Inline gap="nano" justify="flex-end">
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Inline>
    }
  >
    <Text as="p">Drawer content goes here.</Text>
  </Drawer>
</>
        `.trim(),
      },
    },
  },
};
