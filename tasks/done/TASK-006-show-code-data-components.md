---
id: TASK-006
title: Fix "Show Code" — Drawer, Modal, Pagination, Badge, FieldSelector, Table stories
status: done
model: cheap
model-name: SWE-1.6
context:
  - apps/storybook/AGENTS.md
doc-impact: []
---

## Description

Continuation of the "Show Code" fix established in TASK-005. Same two-pattern approach (documented in `apps/storybook/AGENTS.md`):

- **Convert to args** — stateless stories: remove `render`, use `args`.
- **Add `parameters.docs.source.code`** — stateful stories: keep `render`, add clean code override.

This task covers: `Drawer`, `Modal`, `Pagination`, `Badge`, `FieldSelector`, `Table`.

---

## Acceptance Criteria

All changes are in `apps/storybook/src/stories/web/components/`.

---

### Drawer (`Drawer/Drawer.stories.tsx`)

All three docs-referenced stories use `useState` for open/close. Add `source.code` to each.

- [ ] `Basic` — source.code:
  ```
  const [open, setOpen] = useState(false);
  
  <>
    <Button onClick={() => setOpen(true)}>Open drawer</Button>
    <Drawer
      open={open}
      title="Drawer title"
      onClose={() => setOpen(false)}
      footer={
        <Inline gap="nano" justify="flex-end">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Inline>
      }
    >
      <Text as="p">Drawer content goes here.</Text>
    </Drawer>
  </>
  ```

- [ ] `LeftSide` — source.code:
  ```
  const [open, setOpen] = useState(false);
  
  <>
    <Button onClick={() => setOpen(true)}>Open left drawer</Button>
    <Drawer
      open={open}
      side="left"
      title="Left drawer"
      onClose={() => setOpen(false)}
      footer={
        <Inline gap="nano" justify="flex-end">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Inline>
      }
    >
      <Text as="p">Drawer content goes here.</Text>
    </Drawer>
  </>
  ```

- [ ] `PopMotion` — source.code:
  ```
  const [open, setOpen] = useState(false);
  
  <>
    <Button onClick={() => setOpen(true)}>Open pop drawer</Button>
    <Drawer
      open={open}
      motion="pop"
      title="Pop motion"
      onClose={() => setOpen(false)}
      footer={
        <Inline gap="nano" justify="flex-end">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Inline>
      }
    >
      <Text as="p">Drawer content goes here.</Text>
    </Drawer>
  </>
  ```

---

### Modal (`Modal/Modal.stories.tsx`)

- [ ] `Basic` — source.code:
  ```
  const [open, setOpen] = useState(false);
  
  <>
    <Button onClick={() => setOpen(true)}>Open modal</Button>
    <Modal
      open={open}
      title="Modal title"
      onClose={() => setOpen(false)}
      footer={
        <Inline gap="nano" justify="flex-end">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </Inline>
      }
    >
      <Text as="p">Use Modal for confirmations and focused tasks.</Text>
    </Modal>
  </>
  ```

---

### Pagination (`Pagination/Pagination.stories.tsx`)

**Convert to args pattern:**

- [ ] `SinglePage` — remove render, replace with `args: { page: 1, totalPages: 1 }` (the `onPageChange` action handler is supplied by the `{ action: 'changed' }` argType in meta)

**Add `parameters.docs.source.code`:**

- [ ] `Basic` — source.code:
  ```
  const [page, setPage] = useState(5);
  
  <Pagination page={page} totalPages={12} onPageChange={setPage} />
  ```

- [ ] `FirstPage` — source.code:
  ```
  const [page, setPage] = useState(1);
  
  <Pagination page={page} totalPages={12} onPageChange={setPage} />
  ```

- [ ] `LastPage` — source.code:
  ```
  const [page, setPage] = useState(12);
  
  <Pagination page={page} totalPages={12} onPageChange={setPage} />
  ```

---

### Badge (`Badge/Badge.stories.tsx`)

**Convert to args pattern:**

- [ ] `Playground` — current render is `render: (args) => <Badge {...args} />`. Replace with `export const Playground: Story = {}` (empty object; meta args supply `variant` and `children`)

**Add `parameters.docs.source.code`:**

- [ ] `AllStates` — source.code (clean multi-badge inline):
  ```
  <Inline gap="nano">
    <Badge variant="neutral">Neutral</Badge>
    <Badge variant="success">Success</Badge>
    <Badge variant="warning">Warning</Badge>
    <Badge variant="error">Error</Badge>
    <Badge variant="accent">Accent</Badge>
  </Inline>
  ```

- [ ] `WithLabels` — source.code (representative subset; the actual render has a data map which is implementation noise):
  ```
  <Surface padding="micro" radius="small">
    <Stack gap="nano">
      <Inline gap="nano" align="center" justify="space-between">
        <Text as="span">Deployment pipeline</Text>
        <Badge variant="success">Live</Badge>
      </Inline>
      <Inline gap="nano" align="center" justify="space-between">
        <Text as="span">User onboarding flow</Text>
        <Badge variant="warning">Review</Badge>
      </Inline>
      <Inline gap="nano" align="center" justify="space-between">
        <Text as="span">Payment integration</Text>
        <Badge variant="error">Failed</Badge>
      </Inline>
    </Stack>
  </Surface>
  ```

---

### FieldSelector (`FieldSelector/FieldSelector.stories.tsx`)

All docs-referenced stories use `useState`. Add `source.code` to each. The full `sampleData` and `allFields` objects are implementation details of the story file — the source.code should show simplified, realistic values instead.

- [ ] `Playground` — source.code:
  ```
  const [visibleFields, setVisibleFields] = useState(['name', 'email', 'status']);
  
  <FieldSelector
    fields={['name', 'email', 'status', 'city', 'createdAt']}
    visibleFields={visibleFields}
    onVisibleFieldsChange={setVisibleFields}
  />
  ```

- [ ] `DerivedFromData` — source.code:
  ```
  const rows = [{ name: 'Alice', contact: { email: 'alice@example.com' } }];
  const [visibleFields, setVisibleFields] = useState(['name', 'contact.email']);
  
  <FieldSelector
    data={rows}
    visibleFields={visibleFields}
    onVisibleFieldsChange={setVisibleFields}
  />
  ```

- [ ] `CustomLabelParser` — source.code:
  ```
  const [visibleFields, setVisibleFields] = useState(['name', 'contact.email']);
  
  const labelParser = (path: string) =>
    path.split('.').map(s => s[0].toUpperCase() + s.slice(1)).join(' › ');
  
  <FieldSelector
    fields={['name', 'contact.email', 'address.city']}
    visibleFields={visibleFields}
    onVisibleFieldsChange={setVisibleFields}
    labelParser={labelParser}
  />
  ```

- [ ] `NoFieldsAvailable` — source.code:
  ```
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  
  <FieldSelector
    fields={[]}
    visibleFields={visibleFields}
    onVisibleFieldsChange={setVisibleFields}
  />
  ```

- [ ] `AllStates` — source.code (representative single instance):
  ```
  const [visibleFields, setVisibleFields] = useState(['name', 'email']);
  
  <FieldSelector
    fields={['name', 'email', 'status', 'city']}
    visibleFields={visibleFields}
    onVisibleFieldsChange={setVisibleFields}
  />
  ```

---

### Table (`Table/Table.stories.tsx`)

All four docs-referenced stories use `render` functions (three have no state, one has `useState`). The `useMemo` for `columns` is an implementation detail — `source.code` should show columns as a plain `const`.

- [ ] `Basic` — add source.code (no state, just `useMemo` inside render):
  ```
  const columns = [
    { key: 'name', header: 'Name', sort: (a, b) => a.name.localeCompare(b.name) },
    { key: 'status', header: 'Status' },
    { key: 'count', header: 'Count', sort: (a, b) => a.count - b.count },
  ];
  
  <Card padding="none">
    <Table columns={columns} rows={rows} getRowId={(r) => r.id} />
  </Card>
  ```

- [ ] `CustomCells` — add source.code:
  ```
  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant = row.status === 'active' ? 'success' : row.status === 'new' ? 'accent' : 'neutral';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    { key: 'count', header: 'Count' },
  ];
  
  <Table columns={columns} rows={rows} getRowId={(r) => r.id} />
  ```

- [ ] `Empty` — add source.code:
  ```
  <Table
    columns={[{ key: 'name', header: 'Name' }]}
    rows={[]}
    emptyState={<EmptyState title="No records" description="Try adjusting filters or adding a new record." />}
  />
  ```

- [ ] `SelectableRows` — add source.code:
  ```
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  
  <Table
    selectableRows
    columns={columns}
    rows={rows}
    getRowId={(r) => r.id}
    selectedRowIds={selectedRowIds}
    onSelectedRowIdsChange={setSelectedRowIds}
  />
  ```

---

## Relevant Data

### How to add source.code

```tsx
export const Basic: Story = {
  render: () => { /* existing render unchanged */ },
  parameters: {
    docs: {
      source: {
        code: `
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
        `.trim(),
      },
    },
  },
};
```

### How to convert to args (Badge.Playground example)

```tsx
// Before
export const Playground: Story = {
  render: (args) => <Badge {...args} />,
};

// After
export const Playground: Story = {};
```

### File paths

- `apps/storybook/src/stories/web/components/Drawer/Drawer.stories.tsx`
- `apps/storybook/src/stories/web/components/Modal/Modal.stories.tsx`
- `apps/storybook/src/stories/web/components/Pagination/Pagination.stories.tsx`
- `apps/storybook/src/stories/web/components/Badge/Badge.stories.tsx`
- `apps/storybook/src/stories/web/components/FieldSelector/FieldSelector.stories.tsx`
- `apps/storybook/src/stories/web/components/Table/Table.stories.tsx`

Do not touch `.docs.mdx` files or any files outside `apps/storybook/`.
