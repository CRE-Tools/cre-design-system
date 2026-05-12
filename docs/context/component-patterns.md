# Context: Component Patterns

How components and primitives in `@cre/web-ui` are structured. Follow these patterns exactly when creating or modifying anything in `packages/cre-web-ui/src/`.

---

## File Locations

| Type | Folder | Example |
|---|---|---|
| Interactive component | `src/components/` | `Button.tsx`, `Input.tsx` |
| Layout / typography primitive | `src/primitives/` | `Stack.tsx`, `Text.tsx` |
| Theme utilities | `src/theme/` | `CreThemeProvider.tsx`, `tokens.ts` |
| Internal helpers (not exported) | `src/internal/` | `injectStyles.ts`, `fieldUtils.ts` |
| Public API | `src/index.ts` | all exports |

---

## Component Structure

Every component follows this pattern:

```tsx
import { injectStyles } from '../internal/injectStyles';

// 1. Inject styles exactly once per component type (module-level call)
injectStyles('cre-button', `
  .cre-button {
    background: var(--cre-button-bg);
    color: var(--cre-button-fg);
    /* all values are CSS vars — no hardcoded design values */
  }
  .cre-button:hover {
    background: var(--cre-button-hover-bg);
  }
  /* size/variant overrides use data-* attribute selectors */
  .cre-button[data-size="large"] {
    --cre-button-padding-y: var(--cre-space-medium);
    --cre-button-font-size: var(--cre-font-size-large);
  }
`);

// 2. Props type — explicit, no index signatures
export type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

// 3. Component — functional, forwardRef when it wraps a DOM element
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size = 'medium', variant = 'primary', disabled, onClick, children }, ref) => {
    return (
      <button
        ref={ref}
        className="cre-button"
        data-size={size}
        data-variant={variant}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

---

## Styling Rules

### Always use CSS custom properties
```css
/* ✅ correct */
background: var(--cre-button-bg);
padding: var(--cre-space-small) var(--cre-space-medium);
border-radius: var(--cre-radius-medium);

/* ❌ wrong */
background: #8A0538;
padding: 8px 16px;
border-radius: 6px;
```

### Use data-* attributes for variants and states
Size, variant, and stateful overrides are applied via `[data-*]` selectors. The component sets these as HTML attributes; CSS reads them.

```css
/* in the injected CSS */
.cre-input[data-error="true"] {
  --cre-input-border: var(--cre-feedback-error-border);
}

/* in the component */
<input data-error={hasError ? "true" : undefined} />
```

### Local CSS var overrides for variants
Variants override component-scoped CSS vars rather than setting different property values directly. This keeps the base style as the single control point.

```css
/* base */
.cre-button { padding: var(--cre-button-padding-y) var(--cre-button-padding-x); }

/* size override — redefines the local var */
.cre-button[data-size="large"] {
  --cre-button-padding-y: var(--cre-space-medium);
}
```

---

## `injectStyles` Pattern

`injectStyles(id: string, css: string)` inserts a `<style id="cre-styles-{id}">` tag into `<head>` once. Subsequent calls with the same `id` are no-ops. Call it at module level (outside the component function) so it runs once when the module is first imported.

```ts
// ✅ module level — runs once
injectStyles('cre-modal', `...`);

export function Modal(...) { ... }

// ❌ inside component — runs on every render
export function Modal(...) {
  injectStyles('cre-modal', `...`); // wrong placement
}
```

---

## Primitives vs Components

**Primitives** (`src/primitives/`) are layout and typography building blocks with no interactive behavior or business semantics. They compose via children. They may accept a `as` prop to render a different HTML element.

**Components** (`src/components/`) are interactive or domain-specific. They may consume `useCreTheme()` if they need to react to mode changes in JavaScript (most don't — CSS vars handle it automatically).

---

## Public API (`index.ts`)

All exports go through `src/index.ts`. Never import from internal paths in consumer code. When adding a new component or primitive, add its export here.

Export pattern:
```ts
// component + its props type
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
```

---

## What Not to Do

- **No CSS modules, styled-components, emotion, or Tailwind.** The project uses vanilla CSS via `injectStyles`.
- **No inline `style` prop for design values.** Inline styles bypass the token system.
- **No direct import of `rawTokens.ts` or `tokens.ts` in components.** Components read values from CSS vars, not from JS objects.
- **No `useCreTheme()` unless you need JS access to the mode.** CSS vars update automatically — you rarely need the JS token values.
- **Do not add a component to `src/components/` without adding it to `src/index.ts`.**
