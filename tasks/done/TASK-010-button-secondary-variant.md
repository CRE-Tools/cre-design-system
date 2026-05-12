---
id: TASK-010
title: Add secondary variant to Button and apply to toolbar controls
status: done
model: medium
model-name: GPT-5.2
context:
  - docs/architecture.md
  - docs/context/token-system.md
  - docs/context/component-patterns.md
  - packages/cre-web-ui/AGENTS.md
doc-impact:
  - apps/storybook/src/stories/web/components/Button/Button.docs.mdx
---

## Description

`Button` currently has only one visual variant — primary (accent-colored: `primary[600]` background). Every `<Button>` in the codebase renders with the cranberry/lilac accent color. This is correct for main CTAs but wrong for toolbar controls.

`FieldSelector` and `DateRangeFilter` migrated their triggers and internal buttons to use `<Button>` (TASK-008, TASK-009), but because no secondary variant existed, all of those controls now render as full accent-colored primary buttons. They should look neutral: surface background, border, default text color.

Add a `variant` prop to `Button` with two values:
- `primary` — existing accent behavior (default, no change)
- `secondary` — neutral surface appearance

Then update `FieldSelector` and `DateRangeFilter` to use `variant="secondary"` on all their button controls.

---

## Token changes (do these first)

The secondary token values must flow through the full pipeline, not be hardcoded.

### 1. `tokens.ts`

Extend `CreThemeTokens['components']['button']` to include secondary state tokens:

```ts
components: {
  button: {
    // existing primary tokens (unchanged)
    bg: string; fg: string; border: string;
    hoverBg: string; hoverFg: string; hoverBorder: string;
    activeBg: string; activeFg: string; activeBorder: string;
    disabledBg: string; disabledFg: string; disabledBorder: string;

    // new secondary tokens
    secondaryBg: string;       secondaryFg: string;       secondaryBorder: string;
    secondaryHoverBg: string;  secondaryHoverFg: string;  secondaryHoverBorder: string;
    secondaryActiveBg: string; secondaryActiveFg: string; secondaryActiveBorder: string;
    secondaryDisabledBg: string; secondaryDisabledFg: string; secondaryDisabledBorder: string;
  };
};
```

Extend `buildButtonTokens()` with these values:

```ts
// Secondary: neutral surface appearance
secondaryBg:     p.neutral[100],   // --cre-color-surface
secondaryFg:     p.neutral[1050],  // --cre-color-text
secondaryBorder: p.neutral[200],   // --cre-color-border

secondaryHoverBg:     p.neutral[200],
secondaryHoverFg:     p.neutral[1050],
secondaryHoverBorder: p.neutral[300],

secondaryActiveBg:     p.neutral[300],
secondaryActiveFg:     p.neutral[1050],
secondaryActiveBorder: p.neutral[400],

secondaryDisabledBg:     p.neutral[100],
secondaryDisabledFg:     p.neutral[600],  // textSubtle
secondaryDisabledBorder: p.neutral[200],
```

### 2. `cssVars.ts`

Emit secondary button CSS vars inside `themeTokensToCssVars()`:

```ts
'--cre-button-secondary-bg':     button.secondaryBg,
'--cre-button-secondary-fg':     button.secondaryFg,
'--cre-button-secondary-border': button.secondaryBorder,

'--cre-button-secondary-hover-bg':     button.secondaryHoverBg,
'--cre-button-secondary-hover-fg':     button.secondaryHoverFg,
'--cre-button-secondary-hover-border': button.secondaryHoverBorder,

'--cre-button-secondary-active-bg':     button.secondaryActiveBg,
'--cre-button-secondary-active-fg':     button.secondaryActiveFg,
'--cre-button-secondary-active-border': button.secondaryActiveBorder,

'--cre-button-secondary-disabled-bg':     button.secondaryDisabledBg,
'--cre-button-secondary-disabled-fg':     button.secondaryDisabledFg,
'--cre-button-secondary-disabled-border': button.secondaryDisabledBorder,
```

---

## Button.tsx changes

### 1. CSS

Add a variant selector that locally re-maps the base `--cre-button-*` vars. Because the interactive-state rules already consume `--cre-button-hover-bg`, `--cre-button-active-bg`, etc., locally overriding those vars here means no changes are needed to the hover/active/disabled rules.

```css
[data-cre="button"][data-variant="secondary"] {
  --cre-button-bg:     var(--cre-button-secondary-bg);
  --cre-button-fg:     var(--cre-button-secondary-fg);
  --cre-button-border: var(--cre-button-secondary-border);

  --cre-button-hover-bg:     var(--cre-button-secondary-hover-bg);
  --cre-button-hover-fg:     var(--cre-button-secondary-hover-fg);
  --cre-button-hover-border: var(--cre-button-secondary-hover-border);

  --cre-button-active-bg:     var(--cre-button-secondary-active-bg);
  --cre-button-active-fg:     var(--cre-button-secondary-active-fg);
  --cre-button-active-border: var(--cre-button-secondary-active-border);

  --cre-button-disabled-bg:     var(--cre-button-secondary-disabled-bg);
  --cre-button-disabled-fg:     var(--cre-button-secondary-disabled-fg);
  --cre-button-disabled-border: var(--cre-button-secondary-disabled-border);
}
```

Place this block after the `[data-size]` rules and before the interactive-state rules.

### 2. API

Add `variant` to `CreButtonProps`:

```ts
export type CreButtonVariant = 'primary' | 'secondary';

export type CreButtonProps = {
  // ... existing props
  /**
   * Visual variant.
   * - `primary`   — accent-colored CTA (default)
   * - `secondary` — neutral surface appearance for toolbar and utility controls
   */
  variant?: CreButtonVariant;
};
```

Default: `'primary'` (preserves current behavior everywhere — no regressions).

### 3. Rendering

Pass `data-variant` on the root element:

```tsx
<button
  data-cre="button"
  data-size={size}
  data-variant={variant ?? 'primary'}
  data-icon-only={iconOnly ? 'true' : undefined}
  ...
>
```

---

## Consumer updates

### FieldSelector.tsx

Add `variant="secondary"` to the trigger `<Button>`:

```tsx
<Button
  ref={triggerRef}
  variant="secondary"
  iconOnly
  leadingIcon={<ColumnsIcon />}
  ...
/>
```

### DateRangeFilter.tsx

Add `variant="secondary"` to all four Button usages:

```tsx
{/* Trigger — both icon and field variants */}
<Button ref={triggerRef} variant="secondary" iconOnly ... />
<Button ref={triggerRef} variant="secondary" leadingIcon={...} ... >

{/* Nav buttons */}
<Button size="small" variant="secondary" iconOnly leadingIcon={<Text ...>‹</Text>} ... />
<Button size="small" variant="secondary" iconOnly leadingIcon={<Text ...>›</Text>} ... />

{/* Footer actions */}
<Button size="small" variant="secondary" onClick={...}>Clear</Button>
<Button size="small" variant="secondary" onClick={...}>Done</Button>
```

---

## Storybook

Add a `SecondaryVariant` story to `Button.stories.tsx` showing the secondary button in default, hover, disabled, and icon-only states.

Update `Button.docs.mdx` with a Variants section that shows primary vs secondary side by side and documents when to use each.

---

## Acceptance Criteria

- [ ] `tokens.ts` declares and populates all 12 secondary button token fields
- [ ] `cssVars.ts` emits all 12 `--cre-button-secondary-*` CSS vars
- [ ] `Button` accepts `variant?: 'primary' | 'secondary'`
- [ ] `variant` defaults to `'primary'` — no existing Button usage changes appearance
- [ ] Secondary variant locally overrides `--cre-button-*` vars so all interactive states work without new CSS rules
- [ ] FieldSelector trigger renders as `variant="secondary"` — neutral surface appearance
- [ ] DateRangeFilter trigger (both variants) renders as `variant="secondary"`
- [ ] DateRangeFilter nav buttons render as `variant="secondary"`
- [ ] DateRangeFilter Clear and Done buttons render as `variant="secondary"`
- [ ] A `SecondaryVariant` story exists in Button.stories.tsx
- [ ] Button.docs.mdx has a Variants section

## Relevant Data

Files to change:
- `packages/cre-web-ui/src/theme/tokens.ts` — extend `CreThemeTokens` shape + `buildButtonTokens`
- `packages/cre-web-ui/src/theme/cssVars.ts` — emit secondary vars in `themeTokensToCssVars`
- `packages/cre-web-ui/src/components/Button.tsx` — add CSS rule + `variant` prop
- `packages/cre-web-ui/src/components/FieldSelector.tsx` — add `variant="secondary"`
- `packages/cre-web-ui/src/components/DateRangeFilter.tsx` — add `variant="secondary"` to all four `<Button>` usages
- `apps/storybook/src/stories/web/components/Button/Button.stories.tsx` — new story
- `apps/storybook/src/stories/web/components/Button/Button.docs.mdx` — Variants section

Neutral scale reference from `tokens.ts` (same key, different hex per mode due to scale inversion):
- `neutral[100]` → surface color
- `neutral[200]` → border / hover surface
- `neutral[300]` → active surface / strong hover border
- `neutral[400]` → strong border / active border
- `neutral[600]` → textSubtle (disabled fg)
- `neutral[1050]` → text (default fg)
