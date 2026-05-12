---
id: TASK-005
title: Fix "Show Code" — Input, Field, Select, Checkbox stories
status: done
model: cheap
model-name: SWE-1.6
context:
  - apps/storybook/AGENTS.md
doc-impact: []
---

## Description

Storybook's "Show Code" panel shows the raw render function source for any story that uses a `render` function. This looks like `{ render: () => { const [value, setValue] = useState(''); return <...> } }` instead of clean JSX. For stories referenced in `.docs.mdx` files, this must be fixed.

The fix follows one of two patterns (documented in `apps/storybook/AGENTS.md`):

- **Convert to args** — for stories with no hooks. Remove the `render` function and use `args` instead.
- **Add `parameters.docs.source.code`** — for stories that need `useState`. Keep `render` but add a clean code override.

This task covers: `Input`, `Field`, `Select`, `Checkbox`.

---

## Acceptance Criteria

All changes are in `apps/storybook/src/stories/web/components/`.

### Input (`Input/Input.stories.tsx`)

**Convert to args pattern:**

- [ ] `Disabled` — remove render, replace with `args: { disabled: true, placeholder: 'Disabled' }`
- [ ] `WithError` — remove render, replace with `args: { hasError: true, placeholder: 'Error state' }`

**Add `parameters.docs.source.code`:**

- [ ] `Basic` — source.code:
  ```
  const [value, setValue] = useState('');
  
  <Input value={value} onChange={setValue} placeholder="Type…" />
  ```

- [ ] `WithLeadingTrailing` — source.code (omit the debug `Text` showing the value):
  ```
  <Input
    value={value}
    onChange={setValue}
    placeholder="Search"
    leading={<SearchIcon />}
    trailing={<span>⌘K</span>}
  />
  ```

- [ ] `EmailField` — source.code:
  ```
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  <Field label="Email" htmlFor="email" error={error || undefined}>
    <Input
      id="email"
      type="email"
      value={email}
      onChange={setEmail}
      hasError={!!error}
      placeholder="you@example.com"
      autoComplete="email"
      inputProps={{
        onBlur: () => {
          if (email && !email.includes('@')) setError('Enter a valid email address');
          else setError('');
        },
      }}
    />
  </Field>
  ```

- [ ] `PasswordField` — source.code:
  ```
  const [password, setPassword] = useState('');
  
  <Field label="Password" htmlFor="password">
    <Input
      id="password"
      type="password"
      value={password}
      onChange={setPassword}
      placeholder="Enter your password"
      autoComplete="current-password"
    />
  </Field>
  ```

---

### Field (`Field/Field.stories.tsx`)

**Add `parameters.docs.source.code`:**

- [ ] `WithInput` — source.code:
  ```
  const [value, setValue] = useState('');
  
  <Field label="Name" description="This is help text" htmlFor="name">
    <Input id="name" value={value} onChange={setValue} placeholder="Type…" />
  </Field>
  ```

- [ ] `WithSelect` — source.code (only the first Field from the story, omit the error field row as it's secondary):
  ```
  const [value, setValue] = useState('');
  
  <Field label="Category" description="Pick one" htmlFor="category">
    <Select
      id="category"
      value={value}
      onChange={setValue}
      placeholder="Select…"
      options={[
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
        { value: 'c', label: 'Option C' },
      ]}
    />
  </Field>
  ```

---

### Select (`Select/Select.stories.tsx`)

**Convert to args pattern:**

- [ ] `Disabled` — remove render, replace with `args: { disabled: true }` (meta already supplies default `options` in its `args`, so those are inherited)

**Add `parameters.docs.source.code`:**

- [ ] `Basic` — source.code:
  ```
  const [value, setValue] = useState('');
  
  <Select
    value={value}
    onChange={setValue}
    placeholder="Select…"
    options={[
      { value: 'new', label: 'New' },
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived' },
    ]}
  />
  ```

---

### Checkbox (`Checkbox/Checkbox.stories.tsx`)

**Convert to args pattern:**

- [ ] `Indeterminate` — remove render, replace with `args: { indeterminate: true, ariaLabel: 'Mixed' }`
- [ ] `Disabled` — remove render, replace with `args: { disabled: true, label: 'Disabled' }`

**Add `parameters.docs.source.code`:**

- [ ] `Basic` — source.code:
  ```
  const [checked, setChecked] = useState(false);
  
  <Checkbox checked={checked} onChange={setChecked} label="Enable setting" />
  ```

---

## Relevant Data

### How to add source.code to a story

```tsx
export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Stack gap="nano">
        <Input value={value} onChange={setValue} placeholder="Type…" />
        <Text as="p" tone="muted">Value: {value || '(empty)'}</Text>
      </Stack>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = useState('');

<Input value={value} onChange={setValue} placeholder="Type…" />
        `.trim(),
      },
    },
  },
};
```

### How to convert a stateless render story to args

```tsx
// Before
export const Disabled: Story = {
  render: () => <Input disabled placeholder="Disabled" />,
};

// After
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled',
  },
};
```

### File paths

- `apps/storybook/src/stories/web/components/Input/Input.stories.tsx`
- `apps/storybook/src/stories/web/components/Field/Field.stories.tsx`
- `apps/storybook/src/stories/web/components/Select/Select.stories.tsx`
- `apps/storybook/src/stories/web/components/Checkbox/Checkbox.stories.tsx`

No other files need to change. Do not touch `.docs.mdx` files.
