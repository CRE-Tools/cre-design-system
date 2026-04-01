import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconSlot, Inline, Surface, Text, Button, Stack } from '@cre/web-ui';

const meta: Meta = {
  title: 'Web/Primitives/IconSlot',
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj;

const DotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="3" fill="currentColor" />
  </svg>
);

export const Basic: Story = {
  render: () => (
    <Surface>
      <Stack gap="micro">
        <Text as="p" tone="muted">IconSlot provides a consistent icon box aligned with Button defaults.</Text>

        <Inline gap="nano" align="center">
          <IconSlot>
            <DotIcon />
          </IconSlot>
          <Text as="span">Leading icon</Text>
        </Inline>

        <Button
          size="regular"
          leadingIcon={<DotIcon />}
          trailingIcon={<DotIcon />}
        >
          Button integration
        </Button>
      </Stack>
    </Surface>
  )
};
