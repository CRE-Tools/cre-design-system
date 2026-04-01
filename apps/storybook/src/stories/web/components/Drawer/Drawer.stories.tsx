import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Drawer, Button, Stack, Text, Inline } from '@cre/web-ui';

const meta: Meta<typeof Drawer> = {
  title: 'Web/Components/Drawer',
  component: Drawer,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof Drawer>;

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
