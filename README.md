# cre-design-system

Cohesive design system for **CRE (Centro de Realidade Estendida)** projects.

This repository is intended to host:
- **Web UI** as reusable web components (documented via Storybook).
- **Unity UI** as reusable Unity components/packages.
- A **Unity WebGL build** that can be embedded into Storybook to demonstrate UI inside a 3D environment.
- A communication layer so Storybook controls can drive changes in the Unity WebGL demo (and vice-versa).

## Repository structure

- **`apps/storybook`**
  Storybook app (React + Vite) used to document and demo the design system.
- **`packages/cre-web-ui`**
  React component library (web) including the token-based theme system.
- **`packages/cre-unity-bridge`**
  React → Unity WebGL communication bridge (used by Storybook Unity stories).
- **`packages/cre-unity-ui`**
  Unity project/package(s) for CRE UI.

## Prerequisites

- Node.js (LTS recommended)
- pnpm

## Install

From the repo root:

```bash
pnpm install
```

## Run Storybook

From the repo root:

```bash
pnpm storybook
```

Storybook runs at `http://localhost:6006`.

The toolbar includes a **Theme** toggle (`light` / `dark`) which is provided via a global `themeMode` and applied with `CreThemeProvider`.

Web component stories live under `apps/storybook/src/stories/web/`.

If you add new exports to `@cre/web-ui`, run `pnpm build:web-ui` (or `pnpm -C packages/cre-web-ui build`) so Storybook picks up updated TypeScript declarations.

## Build Storybook

```bash
pnpm build:storybook
```

Output will be generated under `apps/storybook/storybook-static`.

## Notes

- Unity-specific generated folders are ignored via the root `.gitignore`.
- Unity WebGL build artifacts can be placed under `apps/storybook/public/unity/` and are loaded by the `UnityCanvas` Storybook stories.
