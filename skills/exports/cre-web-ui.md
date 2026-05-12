---
name: cre-web-ui
description: How to use @cre/web-ui — public API, usage patterns, constraints, and how to report changes back to the design system.
source-repo: cre-design-system
generated: 2026-05-12
---

## Overview

`@cre/web-ui` is a token-first React component library. All visual values (color, spacing, typography, radius) are exposed as CSS custom properties via `CreThemeProvider` — components never contain hardcoded design values. This means theming is a pure CSS operation: swap the provider's mode and every component updates with zero JavaScript changes.

---

## Setup

```tsx
import { CreThemeProvider } from '@cre/web-ui';
import '@cre/web-ui/dist/index.css'; // if CSS is shipped separately

// Page owner — applies CSS vars to :root
<CreThemeProvider mode="light" scope="global">
  <App />
</CreThemeProvider>

// Embedded widget — scoped vars, does not pollute :root
<CreThemeProvider mode="dark" scope="local">
  <Widget />
</CreThemeProvider>
```

`scope="global"` is the default. Use `scope="local"` for embedded or widget contexts.

---

## Public API

### Components

| Export | Purpose |
|---|---|
| `Button` | Primary action button. Props: `size`, `variant`, `disabled`, `onClick`. |
| `Input` | Text input with optional `leading` / `trailing` slots. Pair with `Field`. |
| `Field` | Label + description + error wrapper for any input element. |
| `Select` | Single-option dropdown. Accepts `options: SelectOption[]`. |
| `Checkbox` | Controlled boolean. Emits `onChange(checked: boolean)`. |
| `Badge` | Inline status label. Variants: `neutral`, `accent`, `success`, `warning`, `danger`. |
| `Card` | Elevated surface container. `padding` prop controls inset. |
| `Modal` | Centered overlay dialog with backdrop. Controlled via `open` prop. |
| `Drawer` | Slide-in side panel. Controlled via `open` + `onClose`. |
| `DateRangeFilter` | Popover date-range picker. Emits `{ startMs, endMs }` in ms-since-epoch. Use `popoverAlign="right"` when trigger is near the right viewport edge. |
| `Table` | Data table with sorting, row selection, grouped headers, and nested data. |
| `FieldSelector` | Column visibility toggle panel. Pairs with `Table`'s `visibleFields` prop. |
| `Pagination` | Page navigation. Controlled: `page`, `totalPages`, `onPageChange`. |
| `EmptyState` | Zero-results placeholder. `title` + `description` + optional `action`. |
| `ControlsRow` | Two-slot toolbar layout (`left` + `right`). Pairs with Table. |

### Primitives

| Export | Purpose |
|---|---|
| `Box` | Base layout box. Accepts spacing + display props. |
| `Stack` | Vertical flex stack. `gap` prop uses design-token spacing keys. |
| `Inline` | Horizontal flex row. `gap`, `align`, `wrap`. |
| `Cluster` | Wrapping horizontal flow, auto-centering. |
| `Grid` | CSS Grid wrapper with `columns` and `gap`. |
| `Container` | Max-width centered wrapper. `size` prop: `sm`, `md`, `lg`, `xl`. |
| `Surface` | Styled container card with `variant` (flat, raised, …). |
| `Divider` | Horizontal or vertical rule. |
| `Text` | Inline/block text with `tone` and `variant` props. |
| `Heading` | Section heading with level and size props. |
| `IconSlot` | Fixed-size icon wrapper. Normalizes SVG sizing. |
| `ScrollArea` | Overflow scroll container with styled scrollbar. |

### Theme & Token Utilities

| Export | Purpose |
|---|---|
| `CreThemeProvider` | Injects CSS vars into scope. Required at app root. |
| `useCreTheme` | Returns `{ mode, tokens }` — use only when you need JS access to the current mode. |
| `createThemeTokens` | Generates a token object from raw Figma exports. |
| `coreTokens`, `lightColorTokens`, `darkColorTokens` | Raw Figma JSON exports. Rarely needed directly. |
| `coreTokensToCssVars`, `themeTokensToCssVars` | Token-to-CSS-var conversion utilities. |
| `flattenFields` | Flattens a nested object into dot-path keys. Used with `Table`'s `deriveColumns`. |
| `defaultLabelParser`, `getNestedValue` | Helpers for custom Table column rendering. |

---

## Usage Patterns

### Controlled input with Field

```tsx
import { Field, Input } from '@cre/web-ui';

const [value, setValue] = useState('');
const [error, setError] = useState('');

<Field label="Email" htmlFor="email" error={error || undefined}>
  <Input
    id="email"
    type="email"
    value={value}
    onChange={setValue}
    hasError={!!error}
    placeholder="you@example.com"
  />
</Field>
```

### Table with grouped headers and field selection

```tsx
import { Table, ControlsRow, FieldSelector, flattenFields, Card } from '@cre/web-ui';

const allFields = flattenFields(rows);
const [visibleFields, setVisibleFields] = useState(['name', 'contact.email']);

<ControlsRow right={
  <FieldSelector
    fields={allFields}
    visibleFields={visibleFields}
    onVisibleFieldsChange={setVisibleFields}
  />
} />
<Card padding="none">
  <Table
    deriveColumns
    rows={rows}
    visibleFields={visibleFields}
    getRowId={(r) => r.id}
  />
</Card>
```

Column keys with `/` separators (e.g. `scene/buttonClicks/buttonA`) automatically render grouped multi-row headers. Set `groupSeparator="."` for dot-separated keys or `groupSeparator={null}` to disable.

### DateRangeFilter with right-aligned popover

```tsx
import { DateRangeFilter } from '@cre/web-ui';

<DateRangeFilter
  value={dateRange}
  onChange={setDateRange}
  placeholder="Created"
  popoverAlign="right"  // use when trigger is near right edge of viewport
/>
```

---

## Constraints & Gotchas

1. **`CreThemeProvider` is required.** Without it, CSS custom properties are undefined and components render unstyled.

2. **No hardcoded design values.** Every color, spacing, and radius in component CSS comes from `var(--cre-*)`. If you are extending or overriding components, follow the same rule — never hardcode hex values or pixel sizes.

3. **Peer deps are not bundled.** `react` and `react-dom` must be installed in the consuming project. They are not included in the package output.

4. **Outputs are ESM and CJS.** Import from `@cre/web-ui` (the package root), never from `@cre/web-ui/src/...`.

5. **`injectStyles` is idempotent.** Each component injects its CSS once at module load. If you see a component render without styles in SSR or test environments, ensure `document` is available when the module is first imported.

6. **`DateRangeFilter` values are ms-since-epoch.** `startMs` and `endMs` are plain JavaScript timestamps (`Date.now()` format), not Date objects or ISO strings. Convert at your boundaries.

7. **`Table` grouped headers and sticky behavior.** When using grouped headers (`groupSeparator` with `/`-keyed columns), group header rows scroll away naturally during vertical scroll. Only the bottom leaf header row is sticky. This is by design — do not add `position: sticky` back to group rows.

8. **`Input` focus ring inside clipping ancestors.** The focus ring uses a `::before` pseudo-element with `position: absolute`. Ensure the Input's nearest ancestor that has `overflow: hidden` or `border-radius` does not clip it — wrap in a container with adequate padding if needed.

---

## Migration Notes

### 2026-05-05

| Component | Change |
|---|---|
| `DateRangeFilter` | New prop: `popoverAlign?: 'left' \| 'right'` (default `'left'`). Use `'right'` when the trigger is positioned near the right viewport edge to prevent off-screen clipping. |
| `Input` | CSS-only: focus ring changed from `box-shadow` to `::before` pseudo-element. No prop changes. Fixes ring clipping inside `Drawer`, `Surface`, and other overflow/radius ancestors. |
| `Table` | CSS-only: grouped header rendering changed from `border-collapse: collapse` to `border-collapse: separate; border-spacing: 0`. Fixes white-line artefact at sticky cell junctions. Group header rows no longer sticky — only leaf headers stay pinned on scroll. |

---

## Reporting Changes Back

When `@cre/web-ui` is modified (new component, prop change, CSS fix, token change), the change must be logged in `packages/cre-web-ui/STORYBOOK_SYNC.md` in this repo so the Storybook documentation stays in sync. This file is the single handoff point between package development and documentation.

### When to write an entry

Write an entry for every change that affects what a consumer sees or uses:
- New component or primitive
- New or changed prop
- Removed prop or component
- CSS change that affects visible behavior or interaction states
- Token addition or change

Do **not** write an entry for: internal refactors with no visible output change, test changes, build config changes.

### Entry format

```markdown
### [YYYY-MM-DD] <type>: <ComponentName>

- **Type:** new-component | modified-component | new-primitive | modified-primitive | token-change | removed
- **Status:** undocumented
- **Location:** src/components/ComponentName.tsx
- **Summary:** One sentence — what it does and why it was added.
- **Props / Changes:**
  - `propName: type` — description
- **Usage example:**
  ```tsx
  <ComponentName prop="value" />
  ```
- **Storybook notes:**
  What the Storybook story should demonstrate — variants, interaction states,
  edge cases, accessibility notes.
```

Newest entries go at the **top** of the `## Log` section. Set `Status: undocumented` — the architect reads and clears entries after stories are updated.

### Triggering a documentation sync

After entries are written, start an architect session in this repo. The session protocol reads `docs/sync-queue.md` and `packages/cre-web-ui/STORYBOOK_SYNC.md`, then creates tasks in `tasks/` for Windsurf to update the Storybook stories and docs files. Once tasks are complete, the entry `Status` is changed to `documented`.
