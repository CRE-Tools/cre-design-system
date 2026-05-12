---
id: TASK-013
title: Table — Multi-Row Grouped Column Headers
status: done
model: medium
model-name: GPT-5.2
context:
  - docs/context/component-patterns.md
  - packages/cre-web-ui/AGENTS.md
  - apps/storybook/AGENTS.md
doc-impact: []
---

## Description

When column keys contain a path separator (e.g. `tutorial_scene_a/buttonClicks/buttonA`), the Table currently renders a single flat `<th>` with the full string, which is unreadable. The fix is a multi-row `<thead>` that groups related columns under shared ancestor header cells using standard HTML `colspan` and `rowspan`.

**Depends on TASK-012** — the `buildFieldTree` utility added to `fieldUtils.ts` in that task is reused here. Complete TASK-012 first, or implement both in the same session.

**Files to change:**
- `packages/cre-web-ui/src/internal/fieldUtils.ts` — add three header-tree utilities
- `packages/cre-web-ui/src/components/Table.tsx` — conditional multi-row `<thead>`, new `groupSeparator` prop, CSS for group cells
- `apps/storybook/src/stories/web/components/Table/Table.stories.tsx` — add `GroupedHeaders` story
- `apps/storybook/src/stories/web/components/Table/Table.docs.mdx` — document grouped header behaviour

**Desired output for columns** `platform`, `tutorial_scene_a/durationMs`, `tutorial_scene_a/buttonClicks/buttonA`, `tutorial_scene_a/buttonClicks/buttonB`:

```
┌──────────┬───────────────────────────────────────────┐
│          │            tutorial_scene_a               │
│ platform ├──────────────┬────────────────────────────┤
│          │  durationMs  │        buttonClicks        │
│          │              ├──────────────┬─────────────┤
│          │              │   buttonA    │   buttonB   │
└──────────┴──────────────┴──────────────┴─────────────┘
```

Flat columns (`platform`) span all header rows via `rowspan`. Group cells span their leaf descendants via `colspan`. The existing single-row header is used unchanged when no column key contains the separator.

## Acceptance Criteria

- [ ] When no column key contains `groupSeparator`, `<thead>` renders a single `<tr>` — identical to current behaviour.
- [ ] When at least one column key contains `groupSeparator`, `<thead>` renders N rows where N = max nesting depth across all visible columns.
- [ ] Group header cells span the correct number of leaf-descendant columns (`colspan`).
- [ ] Leaf-level header cells span the remaining header rows (`rowspan = maxDepth - leafDepth + 1`).
- [ ] Flat columns (no separator in key) also receive the correct `rowspan` so they span all header rows.
- [ ] Sort arrows (↑/↓) appear only on leaf-level `<th>` cells, not on group cells.
- [ ] When `selectableRows` is true, the select-all checkbox `<th>` spans all header rows (`rowspan = maxDepth + 1`).
- [ ] `groupSeparator` prop (default `'/'`) can be changed to `'.'` or disabled with `null`.
- [ ] Group `<th>` cells are visually distinct: centred text, right border separating groups.
- [ ] `pnpm --filter @cre/web-ui build` passes with no type errors.
- [ ] A `GroupedHeaders` story exists and is referenced in the `.docs.mdx` with a clean `source.code` snippet.

## Relevant Data

### New prop to add to `TableProps<Row>`

```ts
/**
 * Separator used to parse column keys into header groups.
 * Default '/'. Set to '.' for dot-separated keys, or null to disable grouping entirely.
 */
groupSeparator?: string | null;
```

### Three utilities to add to `fieldUtils.ts`

Place below `buildFieldTree` from TASK-012. If TASK-012 is not yet merged, include `buildFieldTree` as well.

```ts
export type HeaderTreeNode = {
  key: string;       // full path e.g. "tutorial_scene_a/buttonClicks"
  segment: string;   // last segment e.g. "buttonClicks"
  children: HeaderTreeNode[];
  isLeaf: boolean;
  depth: number;     // 0 = root level
};

/** Build a header tree from column key strings. Same algorithm as buildFieldTree. */
export function buildHeaderTree(keys: string[], separator = '/'): HeaderTreeNode[] {
  const root: HeaderTreeNode[] = [];
  for (const key of keys) {
    const parts = key.split(separator);
    let level = root;
    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i];
      const nodeKey = parts.slice(0, i + 1).join(separator);
      const isLeaf = i === parts.length - 1;
      let node = level.find((n) => n.key === nodeKey);
      if (!node) {
        node = { key: nodeKey, segment, children: [], isLeaf, depth: i };
        level.push(node);
      } else if (isLeaf) {
        node.isLeaf = true;
      }
      level = node.children;
    }
  }
  return root;
}

/** Count leaf descendants of a node (or 1 if the node itself is a leaf with no children). */
export function countHeaderLeaves(node: HeaderTreeNode): number {
  if (node.isLeaf && node.children.length === 0) return 1;
  let count = node.isLeaf ? 1 : 0;
  for (const child of node.children) count += countHeaderLeaves(child);
  return count;
}

/** Return the 0-indexed depth of the deepest leaf across the tree. */
export function headerTreeMaxDepth(nodes: HeaderTreeNode[]): number {
  let max = 0;
  function walk(ns: HeaderTreeNode[], d: number) {
    for (const n of ns) {
      if (n.isLeaf) max = Math.max(max, d);
      walk(n.children, d + 1);
    }
  }
  walk(nodes, 0);
  return max;
}
```

### Detection logic (add inside Table component after `columns` is resolved)

```ts
const useGroupedHeaders =
  !!groupSeparator &&
  columns.some((c) => c.key.includes(groupSeparator));

const headerTree = useMemo(() => {
  if (!useGroupedHeaders || !groupSeparator) return null;
  return buildHeaderTree(columns.map((c) => c.key), groupSeparator);
}, [columns, useGroupedHeaders, groupSeparator]);

const headerMaxDepth = useMemo(
  () => (headerTree ? headerTreeMaxDepth(headerTree) : 0),
  [headerTree],
);
```

### CSS additions in `TABLE_CSS`

All values must use CSS vars — no hardcoded design values.

```css
[data-cre="thGroup"] {
  text-align: center;
  font-size: var(--cre-font-size-micro);
  font-weight: 600;
  color: var(--cre-accent-fg);
  padding: var(--cre-space-nano) var(--cre-space-micro);
  border-bottom: var(--cre-border-width-small) solid var(--cre-accent-border);
  border-right: var(--cre-border-width-small) solid var(--cre-accent-border);
  background: var(--cre-accent-bg);
  position: sticky;
  top: 0;
}

/* Add right border to leaf th as well to visually separate group columns */
[data-cre="th"] {
  /* existing rules unchanged — append: */
  border-right: var(--cre-border-width-small) solid var(--cre-accent-border);
}

[data-cre="th"]:last-child,
[data-cre="thGroup"]:last-child {
  border-right: none;
}
```

### Multi-row `<thead>` rendering algorithm

Implement as a module-level function `renderGroupedHeader` (outside the component) that returns `React.ReactNode`. The function signature and algorithm:

```
1. Allocate an array of rows: rows[0..maxDepth] each starting empty.
2. Walk the tree with DFS. At each node:
   a. If leaf: colspan=1, rowspan=(maxDepth - node.depth + 1). Push into rows[node.depth].
      Apply sort button if the matching column has a sort function.
      Use col.header (the column definition's header value) as label, not node.segment.
   b. If group: colspan=countHeaderLeaves(node), rowspan=1. Push into rows[node.depth].
      Recurse into children.
3. Map rows[] to <tr> elements. Inject the select-all checkbox th (rowspan=maxDepth+1) into rows[0] as the first cell when selectableRows=true.
```

The leaf cell must look up the matching `TableColumn` by `c.key === node.key` and use `c.header` as display content (preserving custom headers set by the consumer).

### `<thead>` JSX change

```tsx
<thead>
  {useGroupedHeaders && headerTree
    ? renderGroupedHeader(/* args */)
    : (
      <tr>
        {/* existing single-row header — unchanged */}
      </tr>
    )}
</thead>
```

### Story data for `GroupedHeaders`

```ts
const rows = [
  {
    platform: 'quest_3',
    sessionDurationMs: 300000,
    'tutorial_scene_a/durationMs': 120000,
    'tutorial_scene_a/buttonClicks/buttonA': 40,
    'tutorial_scene_a/buttonClicks/buttonB': 20,
    'main_experience/durationMs': 180000,
    'main_experience/buttonClicks/rightTrigger': 7,
  },
];

const columns = [
  { key: 'platform', header: 'Platform' },
  { key: 'sessionDurationMs', header: 'Session (ms)' },
  { key: 'tutorial_scene_a/durationMs', header: 'Duration (ms)' },
  { key: 'tutorial_scene_a/buttonClicks/buttonA', header: 'Button A' },
  { key: 'tutorial_scene_a/buttonClicks/buttonB', header: 'Button B' },
  { key: 'main_experience/durationMs', header: 'Duration (ms)' },
  { key: 'main_experience/buttonClicks/rightTrigger', header: 'Right Trigger' },
];
```

The story must use `render` + `parameters.docs.source.code` — see `apps/storybook/AGENTS.md` "Show Code Quality Rule § Fix B".
