---
id: TASK-009
title: Migrate DateRangeFilter buttons to DS Button and fix bugs
status: done
model: medium
model-name: GPT-5.2
context:
  - docs/architecture.md
  - docs/context/component-patterns.md
  - docs/context/token-system.md
  - packages/cre-web-ui/AGENTS.md
doc-impact: []
depends-on: TASK-007
---

## Description

`DateRangeFilter` contains four categories of raw `<button>` elements that bypass the DS Button component, each with hand-rolled CSS duplicating Button's visual logic. Additionally, there are two real bugs and two pieces of dead code that need to be fixed.

File: `packages/cre-web-ui/src/components/DateRangeFilter.tsx`

---

## Bug Fixes (do these first — they're independent of the Button migration)

### Bug 1 — Duplicate React keys in DOW row (line 433)

```tsx
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
// ...
{DOW.map((d) => (
  <Box key={d} as="div" data-cre="dateRangeFilterDow">
    {d}
  </Box>
))}
```

`'S'` appears at indices 0 and 6; `'T'` appears at indices 2 and 4. React will warn about duplicate keys.

**Fix:** Use the day index as the key instead:

```tsx
{DOW.map((d, i) => (
  <Box key={i} as="div" data-cre="dateRangeFilterDow">
    {d}
  </Box>
))}
```

### Bug 2 — Wrong opacity token for disabled state (CSS line 47)

```css
[data-cre="dateRangeFilterTrigger"][disabled] {
  cursor: not-allowed;
  opacity: var(--cre-opacity-opaque);
}
```

`--cre-opacity-opaque` means fully visible (1.0) — this is the wrong token for a disabled dimmed state. Check `tokens.ts` for an appropriate disabled opacity token. If one does not exist, add it to the token system (follow the token pipeline described in `docs/context/token-system.md`). Use it here.

---

## Button Migration

### 1 — Trigger button (lines 370–389)

The main trigger is a 40×40 square (icon variant) or an icon + label button (field variant). Both map directly to DS `<Button>`.

**Icon variant** (`triggerVariant === 'icon'`):
```tsx
<Button
  ref={triggerRef}
  iconOnly
  leadingIcon={<span data-cre="dateRangeFilterIcon"><CalendarIcon /></span>}
  aria-haspopup="dialog"
  aria-expanded={open}
  aria-label={placeholder}
  disabled={disabled}
  onClick={() => { if (!disabled) setOpen((o) => !o); }}
/>
```

**Field variant** (`triggerVariant === 'field'`):
```tsx
<Button
  ref={triggerRef}
  leadingIcon={<span data-cre="dateRangeFilterIcon"><CalendarIcon /></span>}
  aria-haspopup="dialog"
  aria-expanded={open}
  aria-label={placeholder}
  disabled={disabled}
  onClick={() => { if (!disabled) setOpen((o) => !o); }}
>
  {triggerLabel}
</Button>
```

Or use a single conditional render — do whichever is cleaner.

Remove from `DATE_RANGE_FILTER_CSS`:
- `[data-cre="dateRangeFilterTrigger"]`
- `[data-cre="dateRangeFilterTrigger"][data-open="true"]`
- `[data-cre="dateRangeFilterTrigger"]:focus-visible`
- `[data-cre="dateRangeFilterTrigger"][disabled]`
- `[data-cre="dateRangeFilterTrigger"][data-variant="icon"]`

Keep `[data-cre="dateRangeFilterIcon"]` if still used for the icon wrapper sizing.

### 2 — Nav buttons (lines 401–429)

The prev/next month buttons are 32×32 — smaller than Button's `regular` size (40px). There is currently no `small` size in Button.

**Decision:** Add a `small` size to Button as part of this task (do not create a separate task — the scope is small). 

`small` Button spec:
- Height: 32px
- Width: 32px (icon-only)
- Icon size: 16px
- Padding: 0 when icon-only
- Border-radius: `var(--cre-radius-xsmall)` (same as regular)
- Font-size: `var(--cre-font-size-micro)` (if text, but icon-only is the primary use case)

Add to `Button.tsx` BUTTON_CSS:
```css
[data-cre="button"][data-size="small"] {
  --cre-button-padding-y:    var(--cre-space-quark);
  --cre-button-padding-x:    var(--cre-space-quark);
  --cre-button-gap:          var(--cre-space-quark);
  --cre-button-radius:       var(--cre-radius-xsmall);
  --cre-button-icon-size:    16px;
  --cre-button-icon-padding: 0px;
  --cre-button-font-size:    var(--cre-font-size-micro);
  --cre-button-font-weight:  500;
  --cre-button-line-height:  16px;
  height: 32px;
}

[data-cre="button"][data-size="small"][data-icon-only="true"] {
  padding: 0;
  width: 32px;
  justify-content: center;
}
```

Add `'small'` to `CreButtonSize` type.

Replace the nav buttons:
```tsx
<Button
  size="small"
  iconOnly
  leadingIcon={<Text as="span" variant="label">‹</Text>}
  aria-label="Previous month"
  onClick={() => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }}
/>
```

Remove from `DATE_RANGE_FILTER_CSS`:
- `[data-cre="dateRangeFilterNavButton"]`
- `[data-cre="dateRangeFilterNavButton"]:focus-visible`

### 3 — Action buttons: Clear and Done (lines 474–491)

These are text-label buttons at 32px height. Use `<Button size="small">`:

```tsx
<Button
  size="small"
  onClick={() => commit({ startMs: null, endMs: null })}
>
  Clear
</Button>

<Button
  size="small"
  onClick={() => {
    setOpen(false);
    triggerRef.current?.focus();
  }}
>
  Done
</Button>
```

Remove from `DATE_RANGE_FILTER_CSS`:
- `[data-cre="dateRangeFilterAction"]`
- `[data-cre="dateRangeFilterAction"]:focus-visible`

---

## Dead Code Cleanup

### Dead code 1 — Redundant typeof check (line 379)

```tsx
aria-label={typeof placeholder === 'string' ? placeholder : undefined}
```

`placeholder` is typed as `string`. The ternary is always true. Replace with:

```tsx
aria-label={placeholder}
```

### Dead code 2 — Unreachable triggerLabel branch (lines 360–366)

```ts
const triggerLabel = useMemo(() => {
  const { startMs, endMs } = currentValue;
  if (startMs == null && endMs == null) return placeholder;
  if (startMs != null && endMs == null) return `${formatShortDate(startMs)} —`;
  if (startMs != null && endMs != null) return `${formatShortDate(startMs)} — ${formatShortDate(endMs)}`;
  return placeholder; // ← unreachable: covered by the first branch
}, [currentValue, placeholder]);
```

The final `return placeholder` is unreachable because the first branch catches `startMs == null`. Remove it:

```ts
const triggerLabel = useMemo(() => {
  const { startMs, endMs } = currentValue;
  if (startMs == null) return placeholder;
  if (endMs == null) return `${formatShortDate(startMs)} —`;
  return `${formatShortDate(startMs)} — ${formatShortDate(endMs)}`;
}, [currentValue, placeholder]);
```

---

## Acceptance Criteria

- [ ] DOW row uses index-based keys — no React duplicate-key warnings
- [ ] Disabled opacity uses a semantically correct token (not `--cre-opacity-opaque`)
- [ ] Trigger button uses DS `<Button>` with `iconOnly` (icon variant) or `leadingIcon` (field variant)
- [ ] Nav buttons use DS `<Button size="small" iconOnly>`
- [ ] Footer Clear/Done buttons use DS `<Button size="small">`
- [ ] `Button` accepts `'small'` as a valid size with 32px height
- [ ] `Button` accepts `'small'` with `iconOnly` for a 32×32 square
- [ ] All hand-rolled CSS blocks that duplicated Button styles are removed from `DATE_RANGE_FILTER_CSS`
- [ ] The `typeof placeholder` ternary is simplified to just `aria-label={placeholder}`
- [ ] The unreachable `triggerLabel` branch is removed
- [ ] Popover open/close behavior, click-outside, and Escape key handling are unchanged
- [ ] Calendar selection behavior (single click = start, second click = end) is unchanged

## Relevant Data

`triggerRef` is used at line 489 to return focus after the Done button is clicked. The `<Button>` component must accept a `ref` (see TASK-008 note about `React.forwardRef`).

The `small` Button size token values to check in `tokens.ts`:
- `--cre-space-quark` — should be ≤8px (used for padding)
- `--cre-font-size-micro` — should be ≤12px

If these tokens don't exist at the right scale, add them via the token pipeline. Do not hardcode pixel values.

The `CalendarIcon` and `ColumnsIcon` SVGs are private to their files — keep them there.
