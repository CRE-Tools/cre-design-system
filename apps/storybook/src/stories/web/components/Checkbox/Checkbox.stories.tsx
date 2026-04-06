import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Checkbox, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof Checkbox> = {
  title: 'Web/Components/Checkbox',
  component: Checkbox,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    checked: { control: false },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
    onChange: { action: 'changed' },
    style: { control: false },
  },
  args: {
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    label: 'Enable setting',
    ariaLabel: '',
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {
  render: (args) => {
    const { label, ariaLabel, ...rest } = args;
    const effectiveLabel = label ? label : undefined;
    const effectiveAriaLabel = effectiveLabel == null ? ariaLabel : undefined;

    return (
      <Stack gap="nano">
        <Checkbox {...rest} label={effectiveLabel} ariaLabel={effectiveAriaLabel} checked={undefined} />
      </Stack>
    );
  },
};

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
