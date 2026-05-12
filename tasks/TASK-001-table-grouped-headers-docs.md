---
id: TASK-001
title: Document Table grouped headers sticky behavior
status: pending
model: cheap
model-name: SWE-1.6
context:
  - docs/architecture.md
  - apps/storybook/AGENTS.md
doc-impact: []
---

## Description

The Table component received a CSS-only fix that changed grouped header behavior during vertical scroll. The fix (`border-collapse: separate`, removed `position: sticky` from group cells, added `z-index: 1` to leaf headers) means group header rows now scroll away naturally while only the bottom leaf header row stays sticky. No prop changes.

The `GroupedHeaders` story in `Table.stories.tsx` already exists and renders the correct output. Two documentation files need updating.

**File 1 — `apps/storybook/src/stories/web/components/Table/Table.stories.tsx`**

The `GroupedHeaders` export has no JSDoc comment. Add one above it describing the sticky scroll behavior: group header rows scroll away during vertical scroll; only the leaf header row stays sticky.

**File 2 — `apps/storybook/src/stories/web/components/Table/Table.docs.mdx`**

The "Grouped column headers" section already has a `<Canvas of={TableStories.GroupedHeaders} />` block but says nothing about scroll behavior. Add a sentence after the Canvas block explaining that group header rows scroll away during vertical scroll — only the leaf header row remains sticky. Place it between the `<Canvas />` block and the existing `groupSeparator` description.

**File 3 — `packages/cre-web-ui/STORYBOOK_SYNC.md`**

Change the Table entry's `Status` field from `undocumented` to `documented`.

## Acceptance Criteria

- [ ] `GroupedHeaders` story in `Table.stories.tsx` has a JSDoc comment describing the sticky-leaf / scrolling-group behavior
- [ ] `Table.docs.mdx` "Grouped column headers" section notes that group rows scroll while leaf headers stay sticky
- [ ] Table entry in `packages/cre-web-ui/STORYBOOK_SYNC.md` has `Status: documented`

## Relevant Data

Current `GroupedHeaders` export (no JSDoc, around line 406 in `Table.stories.tsx`):
```tsx
export const GroupedHeaders: Story = {
  render: () => { ... }
}
```

Current docs.mdx structure around the Canvas block (lines ~52–63):
```mdx
## Grouped column headers

When column keys contain a separator (default `/`), the table automatically renders...

<Canvas of={TableStories.GroupedHeaders} />

The `groupSeparator` prop controls this behavior:
```

Insert the sticky behavior note between `<Canvas ... />` and `The \`groupSeparator\` prop...`.
