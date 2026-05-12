---
id: TASK-008
title: Migrate FieldSelector trigger to DS Button
status: done
model: cheap
model-name: SWE-1.6
context:
  - docs/architecture.md
  - docs/context/component-patterns.md
  - packages/cre-web-ui/AGENTS.md
doc-impact: []
depends-on: TASK-007
---

## Description

`FieldSelector`'s trigger is a bare `<button>` element with hand-rolled CSS that duplicates Button's visual logic (border, background, color, border-radius, focus ring, hover/open states). This means FieldSelector will silently diverge from Button whenever tokens change.

Replace the trigger with the DS `<Button>` component using `iconOnly` (added in TASK-007). Remove the now-redundant CSS from `FIELD_SELECTOR_CSS`. Also add a `disabled` prop to `FieldSelector`, which is currently missing entirely.

File: `packages/cre-web-ui/src/components/FieldSelector.tsx`

### Changes required

**1. Replace the raw trigger button**

Current (lines 185–196):
```tsx
<button
  ref={triggerRef}
  type="button"
  data-cre="fieldSelectorTrigger"
  data-open={open ? 'true' : 'false'}
  aria-haspopup="dialog"
  aria-expanded={open}
  aria-label={ariaLabel}
  onClick={() => setOpen((o) => !o)}
>
  <ColumnsIcon />
</button>
```

Target:
```tsx
<Button
  ref={triggerRef}
  iconOnly
  leadingIcon={<ColumnsIcon />}
  aria-haspopup="dialog"
  aria-expanded={open}
  aria-label={ariaLabel}
  disabled={disabled}
  onClick={() => !disabled && setOpen((o) => !o)}
/>
```

Note: `Button` will need to forward `ref` and pass-through additional aria attributes. Check if `Button` currently accepts `aria-*` props. If not, add spread of remaining HTML button attributes via `...rest` — but keep it minimal, only what's needed here.

**2. Remove the now-redundant CSS**

Remove these rules from `FIELD_SELECTOR_CSS` (they are now owned by Button):
- `[data-cre="fieldSelectorTrigger"]` — entire block
- `[data-cre="fieldSelectorTrigger"][data-open="true"]` — entire block
- `[data-cre="fieldSelectorTrigger"]:focus-visible` — entire block

Keep:
- `[data-cre="fieldSelectorRoot"]` — layout wrapper, still needed
- `[data-cre="fieldSelectorPopover"]` and its state rules — still needed
- `[data-cre="fieldSelectorItem"]` — still needed

**3. Add `disabled` prop to FieldSelector**

```ts
export type FieldSelectorProps = {
  // ... existing props
  /** Disables the trigger button. */
  disabled?: boolean;
};
```

Pass through to `<Button disabled={disabled}>`.

**4. Open/active visual state**

The current CSS shows a focus ring when `data-open="true"`. Button does not have a concept of "open state" styling. Instead, rely on `aria-expanded` for screen readers and accept that the visual open-state highlight will be handled by focus (the button is focused when it opens the popover). If product later needs a persistent "active" ring when the popover is open, that's a separate design decision — do not add it now.

### Button API note

If `Button` does not currently accept a `ref` prop, add `React.forwardRef` wrapping. If it does not spread `aria-*` props, add a typed `aria-haspopup` and `aria-expanded` to `CreButtonProps`, or use `React.ComponentPropsWithoutRef<'button'>` for the rest spread pattern. Keep it minimal.

## Acceptance Criteria

- [ ] FieldSelector trigger is rendered using DS `<Button iconOnly leadingIcon={...} />`
- [ ] The duplicated trigger CSS blocks are removed from `FIELD_SELECTOR_CSS`
- [ ] `FieldSelector` accepts a `disabled` prop that disables the trigger
- [ ] Focus ring, hover, and disabled states are driven by Button's token-based styles — no one-off overrides
- [ ] The popover open/close behavior is unchanged
- [ ] Escape key and click-outside close behavior is unchanged

## Relevant Data

Current `FIELD_SELECTOR_CSS` blocks to remove (lines 16–41):
```css
[data-cre="fieldSelectorTrigger"] { ... }
[data-cre="fieldSelectorTrigger"][data-open="true"] { ... }
[data-cre="fieldSelectorTrigger"]:focus-visible { ... }
```

`ColumnsIcon` is a file-private SVG component inside `FieldSelector.tsx` — keep it there, just pass it as `leadingIcon`.

The `triggerRef` is used at line 163 to return focus after Escape. The `<Button>` component will need to accept a `ref` for this to work.
