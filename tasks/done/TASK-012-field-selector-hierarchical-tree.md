---
id: TASK-012
title: FieldSelector — Hierarchical Grouped Tree UI & UX Polish
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

The FieldSelector currently renders a flat list of full field-path strings as checkbox labels (e.g. `"Tutorial Scene A / Button Clicks / Button A"`). When consumers pass hierarchically structured field paths (e.g. `"tutorial_scene_a/buttonClicks/buttonA"`), the result is unreadable labels, no grouping, and no way to toggle an entire group at once.

Three concrete problems to fix in this task:

1. **No grouping** — flat list of long strings. Should be an indented tree where each path segment is a level.
2. **Checkbox width inconsistency** — the checkbox input element changes apparent width when label text is short vs. long. It must stay a fixed size.
3. **No internal scroll** — when there are many fields the entire page scrolls. The popover field list should scroll independently using the existing `ScrollArea` primitive.

The separator used to split paths into levels is configurable via a new `groupSeparator` prop (default `'/'`). The consumer is responsible for pre-flattening their data and passing field paths that already use this separator.

**Files to change:**
- `packages/cre-web-ui/src/internal/fieldUtils.ts` — add `buildFieldTree` utility
- `packages/cre-web-ui/src/components/FieldSelector.tsx` — tree rendering, scroll, CSS fixes
- `apps/storybook/src/stories/web/components/FieldSelector/FieldSelector.stories.tsx` — add `HierarchicalFields` story
- `apps/storybook/src/stories/web/components/FieldSelector/FieldSelector.docs.mdx` — document the new prop and tree behaviour

## Acceptance Criteria

- [ ] Fields with no `/` render as a flat list — identical to current behaviour.
- [ ] Fields containing `/` are parsed into an indented tree by prefix segments.
- [ ] Each group row renders a parent checkbox: checked when all descendant leaves are visible, indeterminate when some are, unchecked when none are.
- [ ] Clicking a group checkbox toggles all descendant leaves on or off atomically.
- [ ] Each additional depth level is indented using a CSS-var-based calculation (no hardcoded pixel values).
- [ ] The field list area scrolls independently with a `max-height` constraint; the page does not scroll when the list overflows.
- [ ] The checkbox input element has a fixed width that does not change with label length.
- [ ] `groupSeparator` prop (default `'/'`) controls the split character and works correctly when set to `'.'`.
- [ ] `pnpm --filter @cre/web-ui build` passes with no type errors.
- [ ] A `HierarchicalFields` story exists and is referenced in the `.docs.mdx` with a clean `source.code` snippet.

## Relevant Data

### New prop to add to `FieldSelectorProps`

```ts
/**
 * Separator used to split field paths into tree groups.
 * Default '/' — e.g. "scene/buttonClicks/buttonA" becomes three levels.
 * Use '.' if paths are dot-separated.
 */
groupSeparator?: string;
```

### `buildFieldTree` — add to `packages/cre-web-ui/src/internal/fieldUtils.ts`

Place below the existing exports. Do NOT change existing exports.

```ts
export type FieldTreeNode = {
  /** Full path from root to this node joined by separator. e.g. "scene/buttonClicks" */
  key: string;
  /** The last segment label only. e.g. "buttonClicks" */
  segment: string;
  children: FieldTreeNode[];
  isLeaf: boolean;
};

/**
 * Build a tree from flat field path strings.
 * ["sessionId", "scene/durationMs", "scene/buttonA"]
 * → [ {key:"sessionId", leaf}, {key:"scene", group → [{key:"scene/durationMs"}, {key:"scene/buttonA"}]} ]
 */
export function buildFieldTree(fields: string[], separator = '/'): FieldTreeNode[] {
  const root: FieldTreeNode[] = [];
  for (const field of fields) {
    const parts = field.split(separator);
    let level = root;
    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i];
      const key = parts.slice(0, i + 1).join(separator);
      const isLeaf = i === parts.length - 1;
      let node = level.find((n) => n.key === key);
      if (!node) {
        node = { key, segment, children: [], isLeaf };
        level.push(node);
      } else if (isLeaf) {
        node.isLeaf = true;
      }
      level = node.children;
    }
  }
  return root;
}
```

### CSS changes in `FIELD_SELECTOR_CSS`

All values must use CSS vars — no hardcoded pixel values.

**Indentation** — use a CSS custom property set via inline style (following the existing `--cre-th-width` pattern in Table.tsx):

```css
/* Depth is passed as --cre-field-selector-depth on each item */
[data-cre="fieldSelectorItem"] {
  display: flex;
  align-items: center;
  gap: var(--cre-space-nano);
  padding: var(--cre-space-quark) 0;
  padding-left: calc(var(--cre-field-selector-depth, 0) * var(--cre-space-small));
  white-space: nowrap;
}

/* Fixed-width checkbox — flex-shrink prevents it from compressing */
[data-cre="fieldSelectorItem"] input[type="checkbox"] {
  flex-shrink: 0;
}
```

**Scroll container** — add a new rule:

```css
[data-cre="fieldSelectorScroll"] {
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
}
```

In JSX, set the depth value inline (same pattern as Table's `--cre-th-width`):

```tsx
<Box
  as="div"
  data-cre="fieldSelectorItem"
  style={{ '--cre-field-selector-depth': String(depth) } as React.CSSProperties}
>
```

### Tree rendering helpers (implement inside or alongside FieldSelector.tsx)

```tsx
function collectLeaves(node: FieldTreeNode): string[] {
  if (node.isLeaf && node.children.length === 0) return [node.key];
  const leaves: string[] = [];
  if (node.isLeaf) leaves.push(node.key);
  for (const child of node.children) leaves.push(...collectLeaves(child));
  return leaves;
}

function renderTree(
  nodes: FieldTreeNode[],
  depth: number,
  visibleFields: string[],
  onToggle: (key: string, checked: boolean) => void,
  onToggleGroup: (leaves: string[], checked: boolean) => void,
  labelParser: (seg: string) => string,
): React.ReactNode {
  return nodes.map((node) => {
    if (node.isLeaf && node.children.length === 0) {
      return (
        <Box key={node.key} as="div" data-cre="fieldSelectorItem"
          style={{ '--cre-field-selector-depth': String(depth) } as React.CSSProperties}>
          <Checkbox
            id={`field-selector-${node.key}`}
            checked={visibleFields.includes(node.key)}
            label={labelParser(node.segment)}
            onChange={(checked) => onToggle(node.key, checked)}
          />
        </Box>
      );
    }
    const leaves = collectLeaves(node);
    const allChecked = leaves.every((k) => visibleFields.includes(k));
    const someChecked = leaves.some((k) => visibleFields.includes(k));
    return (
      <React.Fragment key={node.key}>
        <Box as="div" data-cre="fieldSelectorItem"
          style={{ '--cre-field-selector-depth': String(depth) } as React.CSSProperties}>
          <Checkbox
            id={`field-selector-group-${node.key}`}
            checked={allChecked}
            indeterminate={!allChecked && someChecked}
            label={labelParser(node.segment)}
            onChange={(checked) => onToggleGroup(leaves, checked)}
          />
        </Box>
        {renderTree(node.children, depth + 1, visibleFields, onToggle, onToggleGroup, labelParser)}
      </React.Fragment>
    );
  });
}
```

Group toggle handler (add alongside existing `toggle`):
```ts
const toggleGroup = (leafKeys: string[], checked: boolean) => {
  const next = checked
    ? Array.from(new Set([...visibleFields, ...leafKeys]))
    : visibleFields.filter((f) => !leafKeys.includes(f));
  onVisibleFieldsChange(next);
};
```

Replace the flat `allFields.map(...)` in the popover JSX with:
```tsx
<div data-cre="fieldSelectorScroll">
  {renderTree(tree, 0, visibleFields, toggle, toggleGroup, resolveLabelParser)}
</div>
```

### Story data for `HierarchicalFields`

```ts
const fields = [
  'sessionDurationMs',
  'platform',
  'tutorial_scene_a/durationMs',
  'tutorial_scene_a/buttonClicks/buttonA',
  'tutorial_scene_a/buttonClicks/buttonB',
  'main_experience/durationMs',
  'main_experience/buttonClicks/rightTrigger',
];
```

The story must use `render` + `parameters.docs.source.code` (it needs `useState`) — see `apps/storybook/AGENTS.md` "Show Code Quality Rule § Fix B".
