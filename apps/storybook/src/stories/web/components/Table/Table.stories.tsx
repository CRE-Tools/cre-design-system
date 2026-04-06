import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { Table, Badge, EmptyState, Stack, Text, Card } from '@cre/web-ui';

type Row = {
  id: string;
  name: string;
  status: 'new' | 'active' | 'archived';
  count: number;
};

const rows: Row[] = [
  { id: 'r1', name: 'Record Alpha', status: 'active', count: 12 },
  { id: 'r2', name: 'Record Beta', status: 'new', count: 3 },
  { id: 'r3', name: 'Record Gamma', status: 'archived', count: 44 },
  { id: 'r4', name: 'Record Delta', status: 'active', count: 7 },
];

const meta: Meta<typeof Table<Row>> = {
  title: 'Web/Components/Table',
  component: Table,
  parameters: { layout: 'padded', docs: { page: null } },
};

export default meta;

type Story = StoryObj<typeof Table<Row>>;

export const Basic: Story = {
  render: () => {
    const columns = useMemo(
      () => [
        { key: 'name', header: 'Name', sort: (a: Row, b: Row) => a.name.localeCompare(b.name) },
        { key: 'status', header: 'Status' },
        { key: 'count', header: 'Count', sort: (a: Row, b: Row) => a.count - b.count },
      ],
      []
    );

    return (
      <Card padding="none">
        <Table columns={columns} rows={rows} getRowId={(r: Row) => r.id} />
      </Card>
    );
  },
};

export const CustomCells: Story = {
  render: () => {
    const columns = useMemo(
      () => [
        { key: 'name', header: 'Name' },
        {
          key: 'status',
          header: 'Status',
          render: (r: Row) => {
            const v = r.status;
            const variant = v === 'active' ? 'success' : v === 'new' ? 'accent' : 'neutral';
            return <Badge variant={variant}>{v}</Badge>;
          },
        },
        { key: 'count', header: 'Count' },
      ],
      []
    );

    return <Table columns={columns} rows={rows} getRowId={(r: Row) => r.id} />;
  },
};

export const Empty: Story = {
  render: () => {
    const columns = useMemo(() => [{ key: 'name', header: 'Name' }], []);
    return (
      <Table
        columns={columns}
        rows={[]}
        emptyState={<EmptyState title="No records" description="Try adjusting filters or adding a new record." />}
      />
    );
  },
};

export const SelectableRows: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['r2']);
    const columns = useMemo(
      () => [
        { key: 'name', header: 'Name' },
        { key: 'status', header: 'Status' },
        { key: 'count', header: 'Count' },
      ],
      []
    );

    return (
      <Stack gap="nano">
        <Table
          selectableRows
          selectedRowIds={selected}
          onSelectedRowIdsChange={setSelected}
          columns={columns}
          rows={rows}
          getRowId={(r: Row) => r.id}
        />
        <Text as="p" tone="muted">Selected: {selected.join(', ') || '(none)'}</Text>
      </Stack>
    );
  },
};
