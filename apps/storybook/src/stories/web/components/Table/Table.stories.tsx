import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { Table, Badge, EmptyState, Stack, Text, Card, ControlsRow, FieldSelector, flattenFields } from '@cre/web-ui';

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

// ── Nested data used by the nested / field-selection stories ──────────────────
type NestedRow = {
  id: string;
  name: string;
  contact: {
    email: string;
    phone: string;
  };
  address: {
    city: string;
    country: string;
  };
  meta: {
    status: 'new' | 'active' | 'archived';
    createdAt: string;
  };
};

const nestedRows: NestedRow[] = [
  {
    id: 'n1',
    name: 'Alice',
    contact: { email: 'alice@example.com', phone: '+1-555-0101' },
    address: { city: 'New York', country: 'US' },
    meta: { status: 'active', createdAt: '2024-01-15' },
  },
  {
    id: 'n2',
    name: 'Bob',
    contact: { email: 'bob@example.com', phone: '+1-555-0202' },
    address: { city: 'London', country: 'UK' },
    meta: { status: 'new', createdAt: '2024-03-22' },
  },
  {
    id: 'n3',
    name: 'Carol',
    contact: { email: 'carol@example.com', phone: '+1-555-0303' },
    address: { city: 'Berlin', country: 'DE' },
    meta: { status: 'archived', createdAt: '2023-11-05' },
  },
];

const meta: Meta<typeof Table<Row>> = {
  title: 'Web/Components/Table',
  component: Table,
  parameters: { layout: 'padded', docs: { page: null } },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    getRowId: { control: false },
    onRowClick: { action: 'rowClicked' },
    selectableRows: { control: 'boolean' },
    selectedRowIds: { control: false },
    defaultSelectedRowIds: { control: false },
    onSelectedRowIdsChange: { action: 'selectionChanged' },
    emptyState: { control: false },
    sortable: { control: 'boolean' },
    className: { control: false },
    style: { control: false },
  },
  args: {
    selectableRows: false,
    sortable: true,
  },
};

export default meta;

type Story = StoryObj<typeof Table<Row>>;

export const Playground: Story = {
  render: (args) => {
    const columns = useMemo(
      () => [
        { key: 'name', header: 'Name', sort: (a: Row, b: Row) => a.name.localeCompare(b.name) },
        { key: 'status', header: 'Status' },
        { key: 'count', header: 'Count', sort: (a: Row, b: Row) => a.count - b.count },
      ],
      []
    );

    const [selected, setSelected] = useState<string[]>(['r2']);

    return (
      <Card padding="none">
        <Table
          {...args}
          columns={columns}
          rows={rows}
          getRowId={(r: Row) => r.id}
          selectedRowIds={args.selectableRows ? selected : undefined}
          onSelectedRowIdsChange={(ids) => {
            args.onSelectedRowIdsChange?.(ids);
            setSelected(ids);
          }}
          onRowClick={(row) => {
            args.onRowClick?.(row);
          }}
        />
      </Card>
    );
  },
};

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

/**
 * Nested objects are automatically flattened into dot-path column keys.
 * The default label parser converts "address.city" → "Address / City".
 */
export const NestedData: Story = {
  render: () => (
    <Card padding="none">
      <Table
        deriveColumns
        rows={nestedRows}
        getRowId={(r: NestedRow) => r.id}
      />
    </Card>
  ),
};

/**
 * The table exposes `visibleFields` to control which columns are shown.
 * Combined with `FieldSelector` in the `ControlsRow`, users can toggle
 * columns on and off without touching column definitions.
 */
export const WithFieldSelection: Story = {
  render: () => {
    const allFields = useMemo(() => flattenFields(nestedRows as Record<string, unknown>[]), []);
    const [visibleFields, setVisibleFields] = useState<string[]>([
      'name',
      'contact.email',
      'address.city',
      'meta.status',
    ]);

    return (
      <Stack gap="nano">
        <ControlsRow
          right={
            <FieldSelector
              fields={allFields}
              visibleFields={visibleFields}
              onVisibleFieldsChange={setVisibleFields}
            />
          }
        />
        <Card padding="none">
          <Table
            deriveColumns
            rows={nestedRows}
            visibleFields={visibleFields}
            getRowId={(r: NestedRow) => r.id}
          />
        </Card>
      </Stack>
    );
  },
};
