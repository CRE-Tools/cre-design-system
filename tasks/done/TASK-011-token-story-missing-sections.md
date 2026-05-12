---
id: TASK-011
title: Add missing token sections to DesignTokens story
status: done
model: cheap
model-name: SWE-1.6
context:
  - docs/architecture.md
  - docs/context/token-system.md
  - packages/cre-web-ui/AGENTS.md
doc-impact: []
---

## Description

`apps/storybook/src/stories/web/Tokens/DesignTokens.stories.tsx` is missing two categories of CSS vars that exist in `cssVars.ts`:

1. **Font size tokens** — `--cre-font-size-*` (quark through huge, 15 steps). These are emitted by `coreTokensToCssVars()` but have no section in the story.
2. **Button component tokens** — all `--cre-button-*` vars including the secondary variant tokens added in TASK-010. These are emitted by `themeTokensToCssVars()` but have no section in the story.

The story must reflect every CSS var emitted by the token pipeline. This is the team's visual catalogue — a var that's missing here is invisible.

---

## Changes required

File: `apps/storybook/src/stories/web/Tokens/DesignTokens.stories.tsx`

### 1. Font Size section

Add after "Font Families" and before "Opacity". Use a text-sample approach similar to Font Families — show the var name, the resolved px value, and a live text preview:

```tsx
<Section title="Font Size">
  {Object.entries(coreTokens.fontSize).map(([name, px]) => (
    <div key={name} style={{ marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--cre-color-text-muted)', minWidth: 200 }}>
        --cre-font-size-{name}
      </code>
      <span style={{ fontSize: 12, color: 'var(--cre-color-text-subtle)', minWidth: 40 }}>{px}px</span>
      <span style={{ fontFamily: 'var(--cre-font-family-body)', fontSize: px, color: 'var(--cre-color-text)', lineHeight: 1.2 }}>
        Aa
      </span>
    </div>
  ))}
</Section>
```

### 2. Button Component Tokens section

Add after "Semantic Accent / Action" and before "Spacing & Padding". Show all button CSS vars as colored swatches (for bg/fg/border) using the live CSS var value so they respond to light/dark mode toggle.

Group into four sub-sections: Primary Default, Primary Interactive, Secondary Default, Secondary Interactive.

```tsx
<Section title="Button Component Tokens">
  <p style={{ fontSize: 13, color: 'var(--cre-color-text-muted)', marginBottom: 16 }}>
    Component-level tokens for Button. These cascade through the variant system — override them locally per variant rather than changing the global values.
  </p>

  {/* Primary variant */}
  <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 13, color: 'var(--cre-color-text)' }}>Primary (default)</div>
  {[
    '--cre-button-bg',
    '--cre-button-fg',
    '--cre-button-border',
    '--cre-button-hover-bg',
    '--cre-button-hover-fg',
    '--cre-button-hover-border',
    '--cre-button-active-bg',
    '--cre-button-active-fg',
    '--cre-button-active-border',
    '--cre-button-disabled-bg',
    '--cre-button-disabled-fg',
    '--cre-button-disabled-border',
  ].map((varName) => (
    <TokenRow
      key={varName}
      label={varName}
      value={`var(${varName})`}
      preview={
        <div style={{
          width: 28,
          height: 28,
          background: `var(${varName})`,
          borderRadius: 4,
          border: '1px solid var(--cre-color-border)',
          flexShrink: 0,
        }} />
      }
    />
  ))}

  {/* Secondary variant */}
  <div style={{ marginTop: 16, marginBottom: 16, fontWeight: 600, fontSize: 13, color: 'var(--cre-color-text)' }}>Secondary</div>
  {[
    '--cre-button-secondary-bg',
    '--cre-button-secondary-fg',
    '--cre-button-secondary-border',
    '--cre-button-secondary-hover-bg',
    '--cre-button-secondary-hover-fg',
    '--cre-button-secondary-hover-border',
    '--cre-button-secondary-active-bg',
    '--cre-button-secondary-active-fg',
    '--cre-button-secondary-active-border',
    '--cre-button-secondary-disabled-bg',
    '--cre-button-secondary-disabled-fg',
    '--cre-button-secondary-disabled-border',
  ].map((varName) => (
    <TokenRow
      key={varName}
      label={varName}
      value={`var(${varName})`}
      preview={
        <div style={{
          width: 28,
          height: 28,
          background: `var(${varName})`,
          borderRadius: 4,
          border: '1px solid var(--cre-color-border)',
          flexShrink: 0,
        }} />
      }
    />
  ))}
</Section>
```

---

## Placement in the render output

The final order of sections should be:

1. Color Palette ← existing
2. Feedback Colors ← existing
3. Semantic Colors ← existing
4. Semantic Accent / Action ← existing
5. **Button Component Tokens** ← NEW
6. Spacing & Padding ← existing
7. Border Radius ← existing
8. Border Width ← existing
9. Font Families ← existing
10. **Font Size** ← NEW
11. Opacity ← existing

---

## Acceptance Criteria

- [ ] A "Font Size" section is present showing all 15 `--cre-font-size-*` vars with a live text preview
- [ ] A "Button Component Tokens" section is present showing all 12 primary `--cre-button-*` vars
- [ ] The same section also shows all 12 `--cre-button-secondary-*` vars
- [ ] All color swatches respond correctly to the light/dark mode toggle in Storybook
- [ ] No existing sections are removed or reordered (only additions)

## Relevant Data

`coreTokens.fontSize` is already imported at the top of the story file and available for iteration.

The `TokenRow` component is already defined in the story file — reuse it for the button token rows.

The `Section` component is already defined in the story file — reuse it for both new sections.

For the button token fg colors: note that `--cre-button-fg` and `--cre-button-secondary-fg` will appear as solid color swatches. `fg` is a foreground (text) color — the swatch background will be that color, which may look odd but is consistent with how `--cre-color-text` is rendered in the Semantic Colors section.
