import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Pagination } from '@cre/web-ui';

const meta: Meta<typeof Pagination> = {
  title: 'Web/Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Basic: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
  },
};
