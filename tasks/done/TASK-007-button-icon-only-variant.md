---
id: TASK-007
title: Add icon-only variant to Button
status: done
model: cheap
model-name: SWE-1.6
context:
  - docs/architecture.md
  - docs/context/component-patterns.md
  - docs/context/token-system.md
  - packages/cre-web-ui/AGENTS.md
doc-impact:
  - apps/storybook/src/stories/web/components/Button/Button.docs.mdx
---

## Description

`Button` currently always renders with horizontal padding (`--cre-button-padding-x`) even when `children` is absent. There is no way to produce a square, icon-only button through the DS — components that need one (FieldSelector, DateRangeFilter) are bypassing Button entirely and duplicating its CSS.

Add an `iconOnly` prop to `Button` that:
- Removes horizontal padding
- Enforces a fixed square size equal to the button's height (40px for `regular`, to be determined for future sizes)
- Hides the empty `IconSlot` wrappers for the unused icon slot

File: `packages/cre-web-ui/src/components/Button.tsx`

### Current API

```ts
export type CreButtonProps = {
  children?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  size?: CreButtonSize; // 'regular' | 'large' | 'vr'
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
  onClick?: () => void;
};
```

### Target API

```ts
export type CreButtonProps = {
  children?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  size?: CreButtonSize;
  /** When true: collapses padding, enforces a square size, renders only the leading icon. */
  iconOnly?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
  onClick?: () => void;
};
```

### CSS change

Add a `[data-icon-only="true"]` rule under each size variant. For `regular`:

```css
[data-cre="button"][data-size="regular"][data-icon-only="true"] {
  padding: 0;
  width: 40px;     /* matches height: 40px set on regular */
  justify-content: center;
}
```

For `large`, derive the square size from its natural height (padding-y × 2 + line-height = 12+12+24 = 48px):

```css
[data-cre="button"][data-size="large"][data-icon-only="true"] {
  padding: 0;
  width: 48px;
  height: 48px;
  justify-content: center;
}
```

`vr` is unlikely to be used icon-only; skip unless needed.

### Rendering change

When `iconOnly` is true:
- Pass `data-icon-only="true"` on the root element
- Render only `<IconSlot>{leadingIcon}</IconSlot>` (no children, no trailing slot)
- `children` is ignored (can assert this in types with a conditional or just leave as optional and document the behaviour)

### Storybook

Add an `IconOnly` story to `apps/storybook/src/stories/web/components/Button/Button.stories.tsx` using an SVG icon as `leadingIcon` with `iconOnly`.

Update `apps/storybook/src/stories/web/components/Button/Button.docs.mdx` with an Icon-only section.

## Acceptance Criteria

- [ ] `Button` accepts `iconOnly?: boolean`
- [ ] When `iconOnly` is true, the button renders as a square (40px × 40px for `regular`; 48px × 48px for `large`)
- [ ] When `iconOnly` is true, only the `leadingIcon` is rendered inside the button — no children, no trailing slot
- [ ] All CSS values come from existing tokens or the button's local CSS vars — no new hardcoded values
- [ ] Existing Button stories are unaffected
- [ ] A new `IconOnly` story is present in Button.stories.tsx

## Relevant Data

Button file: `packages/cre-web-ui/src/components/Button.tsx`

The `regular` size rule already sets `height: 40px` at line 89. The icon-only width should match that exactly.

`large` does not set an explicit height — its height is determined by padding + line-height = 12+12+24 = 48px. The icon-only rule for `large` should set both `width` and `height` to 48px explicitly.

Current `IconSlot` usage wraps both slots unconditionally:
```tsx
<IconSlot>{leadingIcon}</IconSlot>
{children}
<IconSlot>{trailingIcon}</IconSlot>
```
When `iconOnly` is true, render only:
```tsx
<IconSlot>{leadingIcon}</IconSlot>
```
