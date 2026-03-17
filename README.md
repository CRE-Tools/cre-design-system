# cre-design-system

Cohesive design system for **CRE (Centro de Realidade Estendida)** projects.

This repository is intended to host:
- **Web UI** as reusable web components (documented via Storybook).
- **Unity UI** as reusable Unity components/packages.
- A **Unity WebGL build** that can be embedded into Storybook to demonstrate UI inside a 3D environment.
- A communication layer so Storybook controls can drive changes in the Unity WebGL demo (and vice-versa).

## Repository structure

- **`apps/storybook`**
  Storybook app (pnpm workspace) used to document and demo the design system.
- **`packages/cre-unity-ui`**
  Unity package(s) for CRE UI.

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

## Build Storybook

```bash
pnpm build:storybook
```

Output will be generated under `apps/storybook/storybook-static`.

## Notes

- Unity-specific generated folders are ignored via the root `.gitignore`.
- The Unity WebGL + Storybook integration will be added next (embedding the WebGL build into a Storybook story and wiring a messaging bridge).
