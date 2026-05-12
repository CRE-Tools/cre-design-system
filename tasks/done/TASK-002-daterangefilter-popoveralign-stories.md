---
id: TASK-002
title: Add popoverAlign prop to DateRangeFilter stories and docs
status: completed
model: cheap
model-name: SWE-1.6
context:
  - docs/architecture.md
  - apps/storybook/AGENTS.md
doc-impact: []
---

## Description

`DateRangeFilter` received a new `popoverAlign?: 'left' | 'right'` prop (default `'left'`). When `'right'`, the popover anchors to the right edge of the trigger, preventing off-screen clipping when the trigger is near the right viewport edge and preventing the trigger from widening/shifting when a date label is selected.

Three files need updating.

**File 1 — `apps/storybook/src/stories/web/components/DateRangeFilter/DateRangeFilter.stories.tsx`**

1. Add `popoverAlign` to `argTypes` in the meta object:
   ```ts
   popoverAlign: {
     control: 'radio',
     options: ['left', 'right'],
     description: "Aligns the popover to the left (default) or right edge of the trigger. Use 'right' when the trigger is near the right edge of the viewport.",
   },
   ```

2. Add a `PopoverAlignment` story after `AllStates`. It should render both alignments side by side using a `Stack` or `Inline`, each with a visible label. Since it uses `render` (needs state), include a `parameters.docs.source.code` override per the "Show Code Quality Rule" in `apps/storybook/AGENTS.md`.

**File 2 — `apps/storybook/src/stories/web/components/DateRangeFilter/DateRangeFilter.docs.mdx`**

Add a "Popover alignment" section after "All states" with a `<Canvas of={DateRangeFilterStories.PopoverAlignment} />` block and a sentence explaining when to use `'right'`.

**File 3 — `packages/cre-web-ui/STORYBOOK_SYNC.md`**

Change the DateRangeFilter entry's `Status` from `undocumented` to `documented`.

## Acceptance Criteria

- [ ] `popoverAlign` present in `argTypes` with `control: 'radio'`, options `['left', 'right']`, and a meaningful description
- [ ] `PopoverAlignment` story exists, renders both alignments, has a `parameters.docs.source.code` override showing clean consumer JSX
- [ ] `DateRangeFilter.docs.mdx` has a "Popover alignment" section with `<Canvas of={DateRangeFilterStories.PopoverAlignment} />`
- [ ] DateRangeFilter entry in `packages/cre-web-ui/STORYBOOK_SYNC.md` has `Status: documented`

## Relevant Data

New prop (from `src/components/DateRangeFilter.tsx`):
```ts
popoverAlign?: 'left' | 'right'
// Default: 'left'
// 'right' anchors popover to right edge of trigger
```

Existing argTypes to place the new entry alongside (lines 9–28 in stories file):
```ts
argTypes: {
  value: { control: false, ... },
  defaultValue: { control: false, ... },
  onChange: { action: 'changed' },
  disabled: { control: 'boolean', ... },
  placeholder: { control: 'text', ... },
  triggerVariant: { control: 'radio', options: ['field', 'icon'], ... },
  className: { control: false },
  style: { control: false },
},
```

The `PopoverAlignment` story needs `useState` for controlled value, so it must use `render` + `parameters.docs.source.code`. The source.code should show just the JSX a developer would copy — no debug text helpers, no render wrapper.
