# Context: Token System

The token system is the foundation of `@cre/web-ui`. Understanding it is required before touching any component or creating theming-related tasks.

---

## 4-Layer Architecture

```
Figma (Tokens Studio)
        ↓
DsTokens/*.tokens.json          ← raw Figma exports, committed to repo
        ↓
rawTokens.ts                    ← normalizes JSON into typed TS objects
        ↓
tokens.ts                       ← maps raw values to semantic roles
        ↓
cssVars.ts                      ← emits CSS custom properties
        ↓
CreThemeProvider                ← injects vars into DOM on mount/mode-change
        ↓
Components (via var(--cre-*))   ← consume vars, never raw values
```

---

## Layer 1 — Figma JSON Exports

**Files**:
- `packages/cre-web-ui/src/DsTokens/Core.tokens.json` — mode-independent: spacing, radius, border-width, opacity, font-family, font-size, layout widths
- `packages/cre-web-ui/src/DsTokens/Light.tokens.json` — light mode color palette
- `packages/cre-web-ui/src/DsTokens/Dark.tokens.json` — dark mode color palette

These are owned by Figma/Tokens Studio. Do not hand-edit them. When the design system is updated in Figma, the JSON files are replaced wholesale.

---

## Layer 2 — Raw Tokens (`rawTokens.ts`)

Parses the JSON into strongly-typed TypeScript objects with three helpers:
- `n(val)` — parses a number value
- `s(val)` — parses a string value
- `c(val, alpha?)` — parses a color (hex or rgba) with optional alpha override

**Exports**:
- `coreTokens` — mode-independent token object
- `lightColorTokens` — `ColorTokens` for light mode
- `darkColorTokens` — `ColorTokens` for dark mode

**`CoreTokens` shape** (key groups):
```
spacing:     { none, quark, nano, pico, micro, tiny, small, medium, large, xlarge, xxlarge, xxxlarge, huge, xhuge, xxhuge, giant, titan }
radius:      { none, xxsmall, xsmall, small, medium, large, xlarge, xxlarge, xxxlarge, huge, xhuge, titan, pill }
borderWidth: { small, medium, large, xlarge, xxlarge, xxxlarge }
opacity:     { extralight, light, medium, strong, opaque }
fontFamily:  { heading, subtitle, body, button, caption, overline }
fontSize:    { quark … huge }  (15 steps)
layout:      { mainW, secoW, focuW, readW, fullW }
```

**`ColorTokens` shape** (key groups):
```
primary:    { 100 … 800 }    (8 shades)
secondary:  { 100 … 900 }    (9 shades)
neutral:    { 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1050 }
tertiary:   { 100 … 900 }    (9 shades)
fix:        { pureBlack, pureWhite, logo }
feedback:   { success, alert, error } each with { 100, 200, 300, 400, 500, 600 }
effects:    { focus }          (rgba with alpha)
```

**Neutral scale inversion**: The `neutral` scale is intentionally inverted between light and dark mode JSON files. `neutral.50` is near-white in light mode and near-black in dark mode. `neutral.1050` is near-black in light, near-white in dark. This means semantic roles (`bg`, `text`) always reference the same key regardless of mode.

---

## Layer 3 — Semantic Tokens (`tokens.ts`)

Maps raw palette entries to **roles** that components understand. The mapping lives in `createThemeTokens(mode)`.

**`CreThemeTokens` shape**:
```typescript
{
  mode: 'light' | 'dark',
  semantic: {
    bg, surface, surfaceRaised,           // surface hierarchy
    text, textMuted, textSubtle,          // text hierarchy
    border, borderStrong,                 // border hierarchy
    focusRing,                            // accessibility
    accentBg, accentFg, accentBorder,     // primary action color (non-button)
    accentHoverBg, accentHoverBorder,     // hover states
    accentActiveBg, accentActiveBorder,   // active/pressed states
    accentDisabledBg, accentDisabledFg, accentDisabledBorder,
  },
  feedback: {
    success: { bg, text, border },
    alert:   { bg, text, border },
    error:   { bg, text, border },
  },
  components: {
    button: {
      bg, fg, border,
      hoverBg, hoverFg, hoverBorder,
      activeBg, activeFg, activeBorder,
      disabledBg, disabledFg, disabledBorder,
    },
  },
}
```

**Current gap**: Only `button` has a dedicated `components.*` entry. Other components consume `semantic.*` values directly via CSS vars. As the design system matures, per-component token groups will be added here.

---

## Layer 4 — CSS Custom Properties (`cssVars.ts`)

Two exported functions:

### `coreTokensToCssVars()`
Returns a static object of mode-independent CSS vars. Called once at module load.

Naming convention: `--cre-{category}-{name}`

```
--cre-space-none, --cre-space-quark, … --cre-space-titan
--cre-radius-none, --cre-radius-xxsmall, … --cre-radius-pill
--cre-border-width-small, … --cre-border-width-xxxlarge
--cre-opacity-extralight, … --cre-opacity-opaque
--cre-font-family-heading, … --cre-font-family-overline
--cre-font-size-quark, … --cre-font-size-huge
--cre-layout-main-w, … --cre-layout-full-w
```

### `themeTokensToCssVars(tokens: CreThemeTokens)`
Returns a mode-specific object. Called on mount and on every mode change.

Naming convention:
- Semantic: `--cre-color-{role}` → `--cre-color-bg`, `--cre-color-text`, `--cre-color-surface`, …
- Accent: `--cre-accent-{state}-{property}` → `--cre-accent-bg`, `--cre-accent-hover-bg`, …
- Feedback: `--cre-feedback-{type}-{property}` → `--cre-feedback-error-bg`, `--cre-feedback-success-text`, …
- Components: `--cre-button-{state}-{property}` → `--cre-button-bg`, `--cre-button-hover-bg`, …

---

## Theme Provider (`CreThemeProvider.tsx`)

```tsx
<CreThemeProvider mode="light" scope="global">
  <App />
</CreThemeProvider>
```

- `mode` — controlled: `'light' | 'dark'`
- `initialMode` — uncontrolled starting value
- `scope` — `'global'` (applies vars to `document.documentElement`) | `'local'` (wraps in a `div`)
- Exposes `useCreTheme()` → `{ mode, setMode, toggleMode, tokens }`

The provider calls `coreTokensToCssVars()` once (static) and `themeTokensToCssVars()` on each mode change, injecting the resulting vars into the target element's style.

---

## Adding New Tokens

When a component needs a value that doesn't exist in the token system:

1. **If it's a new semantic role** — add it to `CreThemeTokens` in `tokens.ts`, map it from the palette in `buildSemanticTokens()` or a new builder function, then emit a CSS var for it in `cssVars.ts`.
2. **If it's a new per-component token** — add a new key under `CreThemeTokens['components']`, build it in `tokens.ts`, and emit the var in `cssVars.ts`.
3. **If it needs a new raw palette value** — this must come from the Figma source. Do not invent palette steps; wait for or request a design system update.
4. **Never hardcode** the value in component CSS as a fallback — that defeats the token system.
5. **Update the token reference story** — whenever you add, rename, or remove CSS vars in `cssVars.ts`, also update `apps/storybook/src/stories/web/Tokens/DesignTokens.stories.tsx` so the visual reference stays in sync. Every CSS var emitted by the token pipeline must have a corresponding row or swatch in that story.

The token reference story is the live, browsable catalogue of the entire design token surface. It is the single place where designers and developers can see every var, its resolved value, and a visual preview. A var that exists in `cssVars.ts` but is absent from the story is invisible to the team.
