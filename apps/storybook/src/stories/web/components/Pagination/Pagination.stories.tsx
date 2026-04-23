import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Pagination, Inline, Stack, Text } from '@cre/web-ui';

const meta: Meta<typeof Pagination> = {
  title: 'Web/Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered', docs: { page: null } },
  argTypes: {
    page: { control: 'number' },
    totalPages: { control: 'number' },
    onPageChange: { action: 'changed' },
    className: { control: false },
    style: { control: false },
  },
  args: {
    page: 5,
    totalPages: 12,
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.page);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(next) => {
          args.onPageChange?.(next);
          setPage(next);
        }}
      />
    );
  },
};

/** Interactive pagination — Previous and Next both enabled. */
export const Basic: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
  },
  parameters: {
    docs: {
      source: {
        code: `
const [page, setPage] = useState(5);

<Pagination page={page} totalPages={12} onPageChange={setPage} />
        `.trim(),
      },
    },
  },
};

/** First page — Previous is disabled. */
export const FirstPage: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
  },
  parameters: {
    docs: {
      source: {
        code: `
const [page, setPage] = useState(1);

<Pagination page={page} totalPages={12} onPageChange={setPage} />
        `.trim(),
      },
    },
  },
};

/** Last page — Next is disabled. */
export const LastPage: Story = {
  render: () => {
    const [page, setPage] = useState(12);
    return <Pagination page={page} totalPages={12} onPageChange={setPage} />;
  },
  parameters: {
    docs: {
      source: {
        code: `
const [page, setPage] = useState(12);

<Pagination page={page} totalPages={12} onPageChange={setPage} />
        `.trim(),
      },
    },
  },
};

/** Single page — both Previous and Next are disabled. */
export const SinglePage: Story = {
  args: { page: 1, totalPages: 1 },
};

export const AllStates: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <Stack gap="micro">
      <Stack gap="nano">
        <Text as="p" variant="label">
          Multi-page
        </Text>
        <Inline gap="nano" align="center" wrap>
          <Pagination page={1} totalPages={12} onPageChange={() => {}} />
          <Pagination page={5} totalPages={12} onPageChange={() => {}} />
          <Pagination page={12} totalPages={12} onPageChange={() => {}} />
        </Inline>
      </Stack>
      <Stack gap="nano">
        <Text as="p" variant="label">
          Single page
        </Text>
        <Pagination page={1} totalPages={1} onPageChange={() => {}} />
      </Stack>
    </Stack>
  ),
};
