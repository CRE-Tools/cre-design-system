import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Container,
  ControlsRow,
  DateRangeFilter,
  type DateRangeValue,
  Drawer,
  EmptyState,
  Field,
  FieldSelector,
  flattenFields,
  Heading,
  Inline,
  Input,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
} from '@cre/web-ui';

type RecordRow = {
  id: string;
  name: string;
  owner: string;
  status: 'new' | 'active' | 'archived';
  contact: {
    email: string;
    phone: string;
  };
  location: {
    city: string;
    country: string;
  };
  createdAtMs: number;
};

const allRows: RecordRow[] = Array.from({ length: 24 }).map((_, i) => {
  const status: RecordRow['status'] = i % 3 === 0 ? 'new' : i % 3 === 1 ? 'active' : 'archived';
  const now = Date.now();
  const createdAtMs = now - i * 24 * 60 * 60 * 1000;
  const owners = ['Alex', 'Jordan', 'Casey'];
  const cities: [string, string][] = [['New York', 'US'], ['London', 'UK'], ['Berlin', 'DE']];
  const [city, country] = cities[i % 3];
  return {
    id: `rec-${i + 1}`,
    name: `Record ${i + 1}`,
    owner: owners[i % 3],
    status,
    contact: {
      email: `${owners[i % 3].toLowerCase()}@example.com`,
      phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
    },
    location: { city, country },
    createdAtMs,
  };
});

// Derive all available fields from the data once.
const allFields = flattenFields(allRows as Record<string, unknown>[]);

// Default visible fields on first render.
const defaultVisibleFields = ['name', 'owner', 'status', 'location.city'];

const meta: Meta = {
  title: 'Web/Composed/GenericDataPage',
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj;

export const Example: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [createdRange, setCreatedRange] = useState<{ startMs: number | null; endMs: number | null }>({
      startMs: null,
      endMs: null,
    });
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [visibleFields, setVisibleFields] = useState<string[]>(defaultVisibleFields);

    const filtered = allRows.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || r.name.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q);
      const matchesStatus = !status || r.status === status;
      const startOk = createdRange.startMs == null || r.createdAtMs >= createdRange.startMs;
      const endOk = createdRange.endMs == null || r.createdAtMs <= createdRange.endMs;
      return matchesQuery && matchesStatus && startOk && endOk;
    });

    const pageSize = 8;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    // Build columns from visibleFields so custom renders (Badge) still apply.
    const columns = useMemo(
      () =>
        visibleFields.map((field) => {
          if (field === 'status') {
            return {
              key: field,
              header: 'Status',
              render: (r: RecordRow) => {
                const variant = r.status === 'active' ? 'success' : r.status === 'new' ? 'accent' : 'neutral';
                return <Badge variant={variant}>{r.status}</Badge>;
              },
            };
          }
          // Auto-derive header label from field path
          const label = field
            .split('.')
            .map((s) => s.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase()))
            .join(' / ');
          return { key: field, header: label };
        }),
      [visibleFields]
    );

    const selected = selectedId ? allRows.find((r) => r.id === selectedId) : null;

    return (
      <div style={{ background: 'var(--cre-color-bg)', minHeight: '100vh' }}>
        <Container>
          <Stack gap="micro" style={{ paddingTop: 'var(--cre-space-large)', paddingBottom: 'var(--cre-space-large)' }}>
            <Stack gap="quark">
              <Heading level={2}>Records</Heading>
              <Text as="p" tone="muted">
                Generic data page composed from library components.
              </Text>
            </Stack>

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
                  <DateRangeFilter
                    value={createdRange}
                    onChange={(next: DateRangeValue) => {
                      setCreatedRange(next);
                      setPage(1);
                    }}
                    placeholder="Created"
                    triggerVariant="icon"
                  />
                </>
              }
              right={
                <>
                  <FieldSelector
                    fields={allFields}
                    visibleFields={visibleFields}
                    onVisibleFieldsChange={setVisibleFields}
                  />
                  <Button onClick={() => { setQuery(''); setStatus(''); setCreatedRange({ startMs: null, endMs: null }); }}>Reset</Button>
                  <Button onClick={() => setModalOpen(true)}>Open modal</Button>
                </>
              }
            />

            <Card padding="none">
              <Table
                columns={columns}
                rows={pageRows}
                getRowId={(r: RecordRow) => r.id}
                onRowClick={(r: RecordRow) => {
                  setSelectedId(r.id);
                  setDrawerOpen(true);
                }}
                emptyState={<EmptyState title="No records" description="Try adjusting your search or filters." />}
              />
            </Card>

            <Inline justify="space-between" align="center" wrap>
              <Text as="p" tone="muted">
                {filtered.length} total
              </Text>
              <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
            </Inline>

            <Drawer
              open={drawerOpen}
              title="Record details"
              onClose={() => setDrawerOpen(false)}
              footer={
                <Inline gap="nano" justify="flex-end" wrap>
                  <Button onClick={() => setDrawerOpen(false)}>Close</Button>
                </Inline>
              }
            >
              {selected ? (
                <Stack gap="micro">
                  <Field label="Name">
                    <Text as="p">{selected.name}</Text>
                  </Field>
                  <Field label="Owner">
                    <Text as="p">{selected.owner}</Text>
                  </Field>
                  <Field label="Status">
                    <Text as="p">{selected.status}</Text>
                  </Field>
                  <Field label="Email">
                    <Text as="p">{selected.contact.email}</Text>
                  </Field>
                  <Field label="Location">
                    <Text as="p">{selected.location.city}, {selected.location.country}</Text>
                  </Field>
                </Stack>
              ) : (
                <EmptyState title="No record selected" description="Select a row to view details." />
              )}
            </Drawer>

            <Modal
              open={modalOpen}
              title="Example modal"
              onClose={() => setModalOpen(false)}
              footer={
                <Inline gap="nano" justify="flex-end" wrap>
                  <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button onClick={() => setModalOpen(false)}>Confirm</Button>
                </Inline>
              }
            >
              <Stack gap="nano">
                <Text as="p">Use Modal for confirmations, forms, and focused tasks.</Text>
                <Text as="p" tone="muted">This example intentionally stays domain-neutral.</Text>
              </Stack>
            </Modal>
          </Stack>
        </Container>
      </div>
    );
  },
};
