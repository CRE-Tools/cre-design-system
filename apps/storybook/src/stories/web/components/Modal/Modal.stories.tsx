import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal, Button, Stack, Text, Inline } from '@cre/web-ui';

const meta: Meta<typeof Modal> = {
  title: 'Web/Components/Modal',
  component: Modal,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    open: { control: false },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    children: { control: false },
    footer: { control: false },
    onClose: { action: 'closed' },
    className: { control: false },
  },
  args: {
    title: 'Modal title',
    dismissible: true,
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => {
            args.onClose?.();
            setOpen(false);
          }}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Use Modal for confirmations, forms, and focused tasks.</Text>
            <Text as="p" tone="muted">Dismiss by clicking outside or pressing Escape.</Text>
          </Stack>
        </Modal>
      </>
    );
  },
};

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const [openDismissible, setOpenDismissible] = useState(false);
    const [openLocked, setOpenLocked] = useState(false);

    return (
      <Stack gap="micro">
        <Inline gap="nano" wrap>
          <Button onClick={() => setOpenDismissible(true)}>Open dismissible</Button>
          <Button onClick={() => setOpenLocked(true)}>Open non-dismissible</Button>
        </Inline>

        <Modal
          open={openDismissible}
          title="Dismissible"
          dismissible
          onClose={() => setOpenDismissible(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpenDismissible(false)}>Cancel</Button>
              <Button onClick={() => setOpenDismissible(false)}>Confirm</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Dismissible modal (click outside / Escape).</Text>
          </Stack>
        </Modal>

        <Modal
          open={openLocked}
          title="Non-dismissible"
          dismissible={false}
          onClose={() => setOpenLocked(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpenLocked(false)}>Close</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Non-dismissible modal (must use action to close).</Text>
          </Stack>
        </Modal>
      </Stack>
    );
  },
};

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          title="Modal title"
          onClose={() => setOpen(false)}
          footer={
            <Inline gap="nano" justify="flex-end" wrap>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </Inline>
          }
        >
          <Stack gap="nano">
            <Text as="p">Use Modal for confirmations, forms, and focused tasks.</Text>
            <Text as="p" tone="muted">Dismiss by clicking outside or pressing Escape.</Text>
          </Stack>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>
  <Modal
    open={open}
    title="Modal title"
    onClose={() => setOpen(false)}
    footer={
      <Inline gap="nano" justify="flex-end">
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={() => setOpen(false)}>Confirm</Button>
      </Inline>
    }
  >
    <Text as="p">Use Modal for confirmations and focused tasks.</Text>
  </Modal>
</>
        `.trim(),
      },
    },
  },
};
