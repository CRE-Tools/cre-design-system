---
id: TASK-015
title: Self-host Poppins and Source Sans 3 fonts in Storybook
status: done
model: medium
model-name: GPT-5.2
context:
  - docs/architecture.md
doc-impact: []
---

## Description

Currently, Storybook loads fonts from Google Fonts at runtime via `apps/storybook/.storybook/preview-head.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
```

This creates two problems:
1. Fonts silently fail in offline dev environments, VPNs that block Google, or CI runners with no internet access — causing all design tokens and components to render with system defaults
2. Each Storybook start makes external network requests that slow initial load

**Fix:** Self-host both font families in Storybook by:
1. Downloading the required woff2 files for Poppins and Source Sans 3
2. Placing them under `apps/storybook/public/fonts/`
3. Replacing the Google Fonts `<link>` in `preview-head.html` with `@font-face` declarations pointing to the local files

### Required font variants

Both families need the following weight/style combinations (matching the current Google Fonts request):

| Family | Style | Weight |
|---|---|---|
| Poppins | normal | 300, 400, 500, 600, 700 |
| Poppins | italic | 400 |
| Source Sans 3 | normal | 300, 400, 500, 600, 700 |
| Source Sans 3 | italic | 400 |

Download woff2 files from Google Fonts or the respective open-source repos:
- Poppins: https://fonts.google.com/specimen/Poppins (or `google-fonts-helper` / `fontsource`)
- Source Sans 3: https://fonts.google.com/specimen/Source+Sans+3

An easy way to get woff2 files: use the `google-webfonts-helper` service or the `fontsource` npm packages to export the files without runtime Google dependency.

### Suggested file layout

```
apps/storybook/public/fonts/
  poppins/
    poppins-300.woff2
    poppins-400.woff2
    poppins-400-italic.woff2
    poppins-500.woff2
    poppins-600.woff2
    poppins-700.woff2
  source-sans-3/
    source-sans-3-300.woff2
    source-sans-3-400.woff2
    source-sans-3-400-italic.woff2
    source-sans-3-500.woff2
    source-sans-3-600.woff2
    source-sans-3-700.woff2
```

### preview-head.html target state

Replace the Google Fonts links with `<style>` containing `@font-face` rules, e.g.:

```html
<style>
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 300;
    font-display: swap;
    src: url('/fonts/poppins/poppins-300.woff2') format('woff2');
  }
  /* … one block per variant … */
  @font-face {
    font-family: 'Source Sans 3';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('/fonts/source-sans-3/source-sans-3-400.woff2') format('woff2');
  }
  /* … */
</style>
```

Note: `font-display: swap` ensures text is visible immediately with a fallback font while the custom font loads.

## Acceptance Criteria

- [x] `apps/storybook/public/fonts/` contains woff2 files for all required Poppins and Source Sans 3 variants
- [x] `preview-head.html` no longer references `fonts.googleapis.com` or `fonts.gstatic.com`
- [x] `preview-head.html` contains `@font-face` declarations for all variants covering weights 300, 400, 500, 600, 700 (normal) and 400 (italic) for both families
- [x] All `@font-face` blocks use `font-display: swap`
- [x] Local font URLs use root-relative paths (`/fonts/...`) that Vite/Storybook serves from `public/`
- [x] Storybook still renders Poppins and Source Sans 3 correctly after this change (verify in browser with devtools network tab showing fonts loaded from `localhost` not Google)
- [x] TASK-014 must be completed first (so the CSS vars resolve to correct names)

## Relevant Data

**File to change:** `apps/storybook/.storybook/preview-head.html`

**Storybook public directory:** `apps/storybook/public/` — files here are served at the root by Vite. If this directory does not exist, create it.

**Font source options (pick one):**
- `fontsource` npm packages: `@fontsource/poppins` and `@fontsource/source-sans-3` — install as devDependencies in the storybook package, then copy the woff2 files from `node_modules/@fontsource/*/files/` into `public/fonts/`. This avoids manual downloads and keeps fonts version-tracked.
- Manual download from `google-webfonts-helper` (gwfh.mranftl.com) — paste the family name, select variants, download zip.

**Preferred approach:** Use `fontsource` packages as devDependencies — they are versioned, lockfile-tracked, and avoid manual binary commits. Copy only the required woff2 variants into `public/fonts/` rather than serving them from node_modules directly (Vite doesn't serve node_modules to the browser by default).
