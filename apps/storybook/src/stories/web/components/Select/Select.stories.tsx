import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Select, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof Select> = {
  title: 'Web/Components/Select',
  component: Select,
  parameters: { layout: 'padded', docs: { page: null } },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Stack gap="nano">
        <Select
          value={value}
          onChange={setValue}
          placeholder="Select…"
          options={[
            { value: 'new', label: 'New' },
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
          ]}
        />
        <Text as="p" tone="muted">
          Value: {value || '(empty)'}
        </Text>
      </Stack>
    );
  },
};

export const Disabled: Story = {
  render: () => <Select disabled options={[{ value: 'a', label: 'Option A' }]} />,
};
