import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ControlsRow, Input, Select, Button } from '@cre/web-ui';

const meta: Meta<typeof ControlsRow> = {
  title: 'Web/Components/ControlsRow',
  component: ControlsRow,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    left: { control: false },
    right: { control: false },
    gap: { control: 'text' },
    wrap: { control: 'boolean' },
    className: { control: false },
    style: { control: false },
  },
  args: {
    gap: 'micro',
    wrap: true,
  },
};

export default meta;

type Story = StoryObj<typeof ControlsRow>;

export const Playground: Story = {
  render: (args) => {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');

    return (
      <ControlsRow
        {...args}
        left={
          <>
            <Input value={query} onChange={setQuery} placeholder="Search" />
            <Select
              value={status}
              onChange={setStatus}
              placeholder="Status"
              options={[
                { value: 'new', label: 'New' },
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </>
        }
        right={
          <>
            <Button>Reset</Button>
            <Button>Apply</Button>
          </>
        }
      />
    );
  },
};

export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');

    return (
      <>
        <ControlsRow
          wrap
          left={
            <>
              <Input value={query} onChange={setQuery} placeholder="Search" />
              <Select
                value={status}
                onChange={setStatus}
                placeholder="Status"
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'active', label: 'Active' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </>
          }
          right={
            <>
              <Button>Reset</Button>
              <Button>Apply</Button>
            </>
          }
        />
        <ControlsRow
          wrap={false}
          left={
            <>
              <Input value={query} onChange={setQuery} placeholder="Search" />
              <Select
                value={status}
                onChange={setStatus}
                placeholder="Status"
                options={[
                  { value: 'new', label: 'New' },
                  { value: 'active', label: 'Active' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </>
          }
          right={
            <>
              <Button>Reset</Button>
              <Button>Apply</Button>
            </>
          }
        />
      </>
    );
  },
};

export const Basic: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');

    return (
      <ControlsRow
        left={
          <>
            <Input value={query} onChange={setQuery} placeholder="Search" />
            <Select
              value={status}
              onChange={setStatus}
              placeholder="Status"
              options={[
                { value: 'new', label: 'New' },
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </>
        }
        right={
          <>
            <Button>Reset</Button>
            <Button>Apply</Button>
          </>
        }
      />
    );
  },
};
