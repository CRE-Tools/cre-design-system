import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Field, Input, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof Input> = {
  title: 'Web/Components/Input',
  component: Input,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    type: { control: { type: 'radio' }, options: ['text', 'email', 'password'] },
    hasError: { control: 'boolean' },
    value: { control: false },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    leading: { control: false },
    trailing: { control: false },
    onChange: { action: 'changed' },
    inputProps: { control: false },
    style: { control: false },
  },
  args: {
    defaultValue: '',
    placeholder: 'Type…',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12.5 12.5 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Playground: Story = {
  render: (args) => {
    return (
      <Stack gap="nano">
        <Input {...args} value={undefined} />
      </Stack>
    );
  },
};

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Stack gap="nano">
        <Input value={value} onChange={setValue} placeholder="Type…" />
        <Text as="p" tone="muted">
          Value: {value || '(empty)'}
        </Text>
      </Stack>
    );
  },
};

export const WithLeadingTrailing: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Input
        value={value}
        onChange={setValue}
        placeholder="Search"
        leading={<SearchIcon />}
        trailing={
          <Text as="span" tone="muted">
            ⌘K
          </Text>
        }
      />
    );
  },
};

export const Disabled: Story = {
  render: () => <Input disabled placeholder="Disabled" />,
};

export const WithError: Story = {
  render: () => <Input hasError={true} placeholder="Error state" />,
};

export const EmailField: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleBlur = () => {
      if (value && !value.includes('@')) {
        setError('Enter a valid email address');
      } else {
        setError('');
      }
    };

    return (
      <Field label="Email" htmlFor="email" error={error || undefined}>
        <Input
          id="email"
          type="email"
          value={value}
          onChange={setValue}
          hasError={!!error}
          placeholder="you@example.com"
          autoComplete="email"
          inputProps={{ onBlur: handleBlur }}
        />
      </Field>
    );
  },
};

export const PasswordField: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          type="password"
          value={value}
          onChange={setValue}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </Field>
    );
  },
};

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack gap="nano">
      <Input placeholder="Default" />
      <Input defaultValue="With value" />
      <Input hasError={true} placeholder="Error state" />
      <Input placeholder="With leading icon" leading={<SearchIcon />} />
      <Input
        placeholder="With trailing"
        trailing={
          <Text as="span" tone="muted">
            ⌘K
          </Text>
        }
      />
      <Input type="email" placeholder="Email" autoComplete="email" />
      <Input type="password" placeholder="Password" autoComplete="current-password" />
      <Input disabled placeholder="Disabled" />
    </Stack>
  ),
};
