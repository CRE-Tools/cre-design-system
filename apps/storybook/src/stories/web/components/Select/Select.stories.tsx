import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Select, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof Select> = {
  title: 'Web/Components/Select',
  component: Select,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    options: { control: false },
    value: { control: false },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
    style: { control: false },
  },
  args: {
    options: [
      { value: 'new', label: 'New' },
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ],
    defaultValue: '',
    placeholder: 'Select…',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Playground: Story = {
  render: (args) => {
    return (
      <Stack gap="nano">
        <Select {...args} value={undefined} />
      </Stack>
    );
  },
};

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
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = useState('');

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
        `.trim(),
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack gap="nano">
      <Select
        placeholder="Default"
        options={[
          { value: 'new', label: 'New' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
      <Select
        value="active"
        placeholder="With value"
        options={[
          { value: 'new', label: 'New' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
      <Select
        disabled
        placeholder="Disabled"
        options={[
          { value: 'new', label: 'New' },
          { value: 'active', label: 'Active' },
          { value: 'archived', label: 'Archived' },
        ]}
      />
    </Stack>
  ),
};
