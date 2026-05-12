---
id: TASK-003
title: Add Input focus-ring-in-Surface story
status: done
model: cheap
model-name: SWE-1.6
context:
  - docs/architecture.md
  - apps/storybook/AGENTS.md
doc-impact: []
---

## Description

The Input focus ring was changed from `box-shadow` on `:focus-within` to a `::before` pseudo-element with absolute positioning and `border-radius: inherit`. This ensures the ring renders correctly when Input is inside a clipping ancestor (e.g. Drawer, or Surface with `border-radius`).

Add a visual-QA story to `Input.stories.tsx` that demonstrates an Input inside a `Surface` component, with a short label explaining what to verify. This story does **not** need to appear in `Input.docs.mdx` — it exists to give reviewers an easy way to verify the fix visually.

**File 1 — `apps/storybook/src/stories/web/components/Input/Input.stories.tsx`**

Add a `FocusedInsideSurface` story after `AllStates`. The story should:
- Render a `Surface` (from `@cre/web-ui`) wrapping a `Stack` that contains a `Text` label and an `Input`
- Use `Surface` variant `"raised"` (or default) so its border-radius is visible
- Include a `Text` as="p" tone="muted" note below the Surface explaining: "Focus the input and verify the focus ring follows the border-radius and is not clipped by the Surface."
- Use the `render` pattern (no need for `parameters.docs.source.code` since it won't be referenced in docs)

**File 2 — `packages/cre-web-ui/STORYBOOK_SYNC.md`**

Change the Input entry's `Status` from `undocumented` to `documented`.

## Acceptance Criteria

- [ ] `FocusedInsideSurface` story exists in `Input.stories.tsx` and renders an Input inside a Surface
- [ ] Story includes a visible reviewer note (via `Text`) describing what to check
- [ ] Input entry in `packages/cre-web-ui/STORYBOOK_SYNC.md` has `Status: documented`

## Relevant Data

Available imports (all from `@cre/web-ui`): `Surface`, `Stack`, `Text`, `Input`.

`Surface` accepts a `variant` prop (`"flat" | "raised" | ...`). Use `"raised"` for a clearly visible border-radius.

The story does not need `useState` since the focus state is triggered manually in the browser — render a simple uncontrolled Input with `placeholder="Focus me"`.
