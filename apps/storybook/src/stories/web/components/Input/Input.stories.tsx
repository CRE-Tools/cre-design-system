import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Input, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof Input> = {
  title: 'Web/Components/Input',
  component: Input,
  parameters: { layout: 'padded', docs: { page: null } },
};

export default meta;

type Story = StoryObj<typeof Input>;

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12.5 12.5 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

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
    return <Input value={value} onChange={setValue} placeholder="Search" leading={<SearchIcon />} trailing={<span style={{ color: 'var(--cre-color-text-muted)' }}>⌘K</span>} />;
  },
};

export const Disabled: Story = {
  render: () => <Input disabled placeholder="Disabled" />,
};
