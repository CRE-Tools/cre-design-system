import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Checkbox, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof Checkbox> = {
  title: 'Web/Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'padded', docs: { page: null } },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Stack gap="nano">
        <Checkbox checked={checked} onChange={setChecked} label="Enable setting" />
        <Text as="p" tone="muted">
          Checked: {String(checked)}
        </Text>
      </Stack>
    );
  },
};

export const Indeterminate: Story = {
  render: () => <Checkbox indeterminate ariaLabel="Mixed" />,
};

export const Disabled: Story = {
  render: () => <Checkbox disabled label="Disabled" />,
};
