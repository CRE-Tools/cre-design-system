---
id: TASK-014
title: Fix "Source Sans Pro" → "Source Sans 3" font name and add fallback stacks
status: completed
model: cheap
model-name: SWE-1.6
context:
  - docs/architecture.md
doc-impact: []
---

## Description

There are two font-family bugs that cause fonts to render incorrectly in Storybook:

### Bug 1 — Font name mismatch (Source Sans Pro vs Source Sans 3)

`Core.tokens.json` (exported from Figma via Tokens Studio) stores `"Source Sans Pro"` as the font family name for the `body`, `caption`, and `overline` roles. Google Fonts renamed this font to **Source Sans 3** — the CSS `font-family` name that browsers see when loading via `family=Source+Sans+3` is `"Source Sans 3"`, not `"Source Sans Pro"`.

Because `rawTokens.ts` passes the raw Figma value through unchanged, the resulting CSS vars are:
```
--cre-font-family-body: Source Sans Pro       ← wrong name, font never matches
--cre-font-family-caption: Source Sans Pro    ← wrong name
--cre-font-family-overline: Source Sans Pro   ← wrong name
```

These vars will never match the loaded font, so the browser falls back to the system default for all body text.

**Fix:** In `packages/cre-web-ui/src/theme/rawTokens.ts`, normalize the extracted value at the point of extraction. Add a small `normalizeFontName` helper (or a lookup map) that maps `"Source Sans Pro"` → `"Source Sans 3"`. Apply it when building `coreTokens.fontFamily`. Do **not** modify `Core.tokens.json` — it is a Figma export and would be overwritten on re-sync.

### Bug 2 — No fallback font stacks

CSS vars are generated as bare font names with no fallback:
```
--cre-font-family-heading: Poppins
--cre-font-family-body: Source Sans 3
```

If the web font fails to load for any reason (network, offline dev environment, CSP), text silently falls back to the browser's UA default. Add `sans-serif` as a fallback to all `--cre-font-family-*` vars.

**Fix:** In `packages/cre-web-ui/src/theme/cssVars.ts`, update the six font-family var values to append `, sans-serif`:
```
--cre-font-family-heading: Poppins, sans-serif
--cre-font-family-body: "Source Sans 3", sans-serif
```

Note: Quote multi-word/number-containing family names (`"Source Sans 3"`) in the CSS var value to follow CSS best practice.

## Acceptance Criteria

- [ ] `coreTokens.fontFamily.body`, `.caption`, and `.overline` all return `"Source Sans 3"` (not `"Source Sans Pro"`)
- [ ] The rawTokens.ts comment for `fontFamily` is updated to say "Source Sans 3" instead of "Source Sans Pro"
- [ ] All six `--cre-font-family-*` CSS vars in `cssVars.ts` include `, sans-serif` as a fallback
- [ ] Multi-word font names (`Source Sans 3`) are wrapped in double-quotes in the CSS var value
- [ ] `Core.tokens.json` is NOT modified
- [ ] TypeScript compiles without errors

## Relevant Data

**Files to change:**
- `packages/cre-web-ui/src/theme/rawTokens.ts` — lines 136–143, the `fontFamily` block
- `packages/cre-web-ui/src/theme/cssVars.ts` — lines 88–93, the font-family var entries

**Current rawTokens.ts fontFamily block (lines 136–143):**
```ts
fontFamily: {
  heading:  s(_ff['heading']),  // Poppins
  subtitle: s(_ff['subtitle']), // Poppins
  body:     s(_ff['body']),     // Source Sans Pro   ← must become "Source Sans 3"
  button:   s(_ff['button']),   // Poppins
  caption:  s(_ff['caption']),  // Source Sans Pro   ← must become "Source Sans 3"
  overline: s(_ff['overline']), // Source Sans Pro   ← must become "Source Sans 3"
},
```

**Current cssVars.ts font-family block (lines 88–93):**
```ts
'--cre-font-family-heading':  fontFamily.heading,   // "Poppins"
'--cre-font-family-subtitle': fontFamily.subtitle,  // "Poppins"
'--cre-font-family-body':     fontFamily.body,      // "Source Sans Pro" → will be "Source Sans 3" after Task bug 1 fix
'--cre-font-family-button':   fontFamily.button,    // "Poppins"
'--cre-font-family-caption':  fontFamily.caption,   // "Source Sans Pro" → will be "Source Sans 3"
'--cre-font-family-overline': fontFamily.overline,  // "Source Sans Pro" → will be "Source Sans 3"
```

**Desired output after both fixes:**
```ts
'--cre-font-family-heading':  'Poppins, sans-serif',
'--cre-font-family-subtitle': 'Poppins, sans-serif',
'--cre-font-family-body':     '"Source Sans 3", sans-serif',
'--cre-font-family-button':   'Poppins, sans-serif',
'--cre-font-family-caption':  '"Source Sans 3", sans-serif',
'--cre-font-family-overline': '"Source Sans 3", sans-serif',
```

**Google Fonts URL in `apps/storybook/.storybook/preview-head.html` (correct, do not change):**
```
family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400
```
