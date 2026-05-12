# Architecture

> Keep this file current. If a decision is made during a Claude session, update it before ending the session.

---

## Overview

`cre-design-system` is a pnpm monorepo that produces a React component library (`@cre/web-ui`) and a Unity WebGL bridge package (`@cre/unity-bridge`). A Storybook app (`apps/storybook`) serves as the canonical interactive documentation and deploys to GitHub Pages on every push to `main`.

All components in `@cre/web-ui` are built **token-first**: they consume CSS custom properties injected by `CreThemeProvider`. No hardcoded colors, spacing, or typography values are allowed anywhere in component code. The design system (tokens) is the single source of truth.

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Package manager | pnpm + workspaces | Monorepo support, fast installs, strict hoisting |
| Language | TypeScript (strict) | Full type safety across library and consumer |
| Build (libraries) | tsup | Zero-config, outputs ESM + CJS + `.d.ts` in one pass |
| Build (docs) | Vite + Storybook 8 | Fast HMR during story dev, static site output for Pages |
| Styling | Vanilla CSS via `injectStyles()` | No runtime CSS-in-JS overhead; CSS vars carry all design decisions |
| Token source | Figma JSON exports (Tokens Studio) | Design and code share the same primitive palette |
| CI/CD | GitHub Actions → GitHub Pages | Auto-deploys storybook on push to main |

---

## Project Structure

```
cre-design-system/
├── apps/
│   └── storybook/              # Storybook 8 (Vite). Dev docs + GitHub Pages deploy.
│       ├── .storybook/         # main.ts (addons, story globs), preview.ts (decorators)
│       └── src/stories/
│           ├── web/components/ # One folder per component: .stories.tsx + .docs.mdx
│           ├── web/foundations/
│           └── Composed/       # Full-page composition examples
├── packages/
│   ├── cre-web-ui/             # Main React component library
│   │   ├── src/
│   │   │   ├── components/     # 15 interactive components (Button, Input, Modal, …)
│   │   │   ├── primitives/     # 12 layout/typography primitives (Box, Stack, Text, …)
│   │   │   ├── theme/          # CreThemeProvider, token factory, CSS var generator
│   │   │   ├── DsTokens/       # Figma JSON exports (Core, Light, Dark)
│   │   │   └── internal/       # injectStyles, fieldUtils (not exported)
│   │   └── dist/               # tsup output (ESM + CJS + types)
│   ├── cre-unity-bridge/       # React ↔ Unity WebGL communication layer
│   │   └── src/
│   │       ├── UnityCanvas.tsx
│   │       ├── useUnityBridge.ts
│   │       └── unityLoader.ts
│   └── cre-unity-ui/           # Unity 2022 project with prefabs + JS bridge plugin
│       └── Assets/CRE/Bridge/
├── docs/
│   ├── architecture.md         # ← this file
│   ├── sync-queue.md           # Windsurf writes; Claude reads and clears
│   └── context/                # Domain-specific knowledge (managed by Claude)
├── tasks/                      # Task queue (pending) and archive (done/)
├── AGENTS.md                   # Windsurf executor rules
└── CLAUDE.md                   # Claude architect rules
```

---

## Key Architectural Decisions

### 1. Token-first styling — no hardcoded values in components
Every color, spacing, radius, or typography value in component CSS must reference a `var(--cre-*)` custom property. Values are never hardcoded. This guarantees that swapping a theme or mode is a pure CSS operation with no JavaScript changes.

**The design system is still incomplete.** Not every semantic role is defined yet. When a needed token doesn't exist, the correct action is to add it to the token system — not to hardcode the value in the component.

### 2. Singleton CSS injection (`injectStyles`)
Each component calls `injectStyles(id, cssString)` once at module load. It inserts a `<style>` tag keyed by `id` into the document head, and skips if the tag is already present. This avoids runtime CSS-in-JS overhead while still scoping styles per component.

### 3. Neutral scale inversion
The neutral scale (50–1050) is intentionally inverted between `Light.tokens.json` and `Dark.tokens.json`. Semantic roles like `bg` (neutral.50) and `text` (neutral.1050) reference the same key in both modes, but the underlying hex value flips. This makes semantic mapping mode-agnostic.

### 4. Semantic token layer
Raw palette values are never referenced directly in components. They flow through `rawTokens.ts → tokens.ts → cssVars.ts → CSS custom properties → components`. This indirection allows palette changes to propagate without touching component code.

### 5. Scope-aware theming
`CreThemeProvider` accepts a `scope` prop:
- `"global"` — applies CSS vars to `document.documentElement` (page owner, default)
- `"local"` — wraps children in a `div` with scoped vars (embedded / widget mode)

### 6. Storybook as living documentation
`.stories.tsx` and `.docs.mdx` files are colocated in `apps/storybook/src/stories/web/components/<Name>/`. Stories use the `themeMode` global (set in `preview.ts`) so reviewers can toggle light/dark. All new components must have both files before a component is considered documented.

---

## Modules & Domains

### `@cre/web-ui` — Component Library
The core deliverable. Exports components, primitives, the theme provider, and token utilities.
- See [docs/context/token-system.md](context/token-system.md) for the full token architecture.
- See [docs/context/component-patterns.md](context/component-patterns.md) for component structure rules.

### `@cre/unity-bridge` — Unity WebGL Bridge
Loads a Unity WebGL build inside a React app and provides bidirectional messaging. Handles `.br` (Brotli) compressed builds, theme sync from React to Unity, and event/command communication.

### `apps/storybook` — Documentation App
Storybook 8 with Vite. Deployed to GitHub Pages. Includes a custom Vite plugin to serve Brotli-encoded Unity bundles with the correct Content-Encoding headers.

---

## External Dependencies & Integrations

| Integration | Purpose |
|---|---|
| Figma (Tokens Studio) | Source of truth for token JSON. Exports to `packages/cre-web-ui/src/DsTokens/`. |
| GitHub Pages | Hosts the built Storybook static site |
| GitHub Actions | Builds `@cre/web-ui` then Storybook on push to `main`, deploys to Pages |
| pnpm workspaces | Manages monorepo package linking and installs |
| Unity 2022 | Consumes `@cre/unity-bridge` for embedded UI in WebGL builds |

---

## Known Constraints & Non-Negotiables

1. **No hardcoded design values.** If a token doesn't exist, extend the token system — do not bypass it.
2. **Peer deps are external.** `react` and `react-dom` are never bundled into library outputs.
3. **tsup outputs both ESM and CJS.** Do not change the build config in a way that drops either format.
4. **Storybook stories must coexist with mdx docs.** Every component story folder needs both `*.stories.tsx` and `*.docs.mdx`.
5. **`AGENTS.md`, `docs/architecture.md`, and `docs/context/*.md` are Claude-managed.** Windsurf must not edit them unless a task explicitly says so — and even then, the file must be added to `docs/sync-queue.md`.
