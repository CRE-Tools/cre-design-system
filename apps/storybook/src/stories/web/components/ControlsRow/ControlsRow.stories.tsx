import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ControlsRow, Input, Select, Button } from '@cre/web-ui';

const meta: Meta<typeof ControlsRow> = {
  title: 'Web/Components/ControlsRow',
  component: ControlsRow,
  parameters: { layout: 'padded' },
};

export default meta;

type Story = StoryObj<typeof ControlsRow>;

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
