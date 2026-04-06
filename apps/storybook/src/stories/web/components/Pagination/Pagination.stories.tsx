import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Pagination } from '@cre/web-ui';

const meta: Meta<typeof Pagination> = {
  title: 'Web/Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered', docs: { page: null } },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

/** Interactive pagination — Previous and Next both enabled. */
export const Basic: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
  },
};

/** First page — Previous is disabled. */
export const FirstPage: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
  },
};

/** Last page — Next is disabled. */
export const LastPage: Story = {
  render: () => {
    const [page, setPage] = useState(12);
    return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
  },
};

/** Single page — both Previous and Next are disabled. */
export const SinglePage: Story = {
  render: () => <Pagination page={1} totalPages={1} onPageChange={() => {}} />,
};
