# AGENTS.md — apps/storybook

Rules for every task that adds or modifies stories in this app.

---

## Story File Conventions

Every component must have **both files** in its own folder:

```
src/stories/web/components/<ComponentName>/
├── <ComponentName>.stories.tsx   ← interactive stories
└── <ComponentName>.docs.mdx      ← written documentation
```

Do not add a component story without the matching `.docs.mdx`, and vice versa.

---

## Story File Structure (`.stories.tsx`)

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '@cre/web-ui';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // default props
  },
};
```

- `title` path must be: `'Components/<Name>'` for components, `'Primitives/<Name>'` for primitives.
- Always export `Default` as the canonical story.
- Additional stories cover significant variants (e.g., `Disabled`, `WithError`, `Large`).

---

## Theme Mode

The Storybook toolbar has a `themeMode` global (`light` / `dark`). All stories automatically receive `CreThemeProvider` via the global decorator in `.storybook/preview.ts`. **Do not wrap stories in a `CreThemeProvider` manually** — the decorator handles it.

---

## MDX Docs (`.docs.mdx`)

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks';
import * as Stories from './ComponentName.stories';

<Meta of={Stories} />

# ComponentName

Brief description of what this component does and when to use it.

## Usage

<Canvas of={Stories.Default} />
<Controls of={Stories.Default} />

## Variants

<!-- Document each significant variant with a Canvas block -->
```

---

## Story Location Rules

| Content | Folder |
|---|---|
| Interactive components | `src/stories/web/components/<Name>/` |
| Layout / typography primitives | `src/stories/web/foundations/<Name>/` (or `primitives/`) |
| Full-page composition examples | `src/stories/Composed/` |
| Package intro / getting-started | `src/stories/Introduction.mdx` |

---

## "Show Code" Quality Rule

Every story referenced in a `<Canvas>` block in the component's `.docs.mdx` **must produce clean, copyable JSX** in Storybook's "Show Code" panel.

**How Storybook generates source code:**
- Stories using only `args` (no `render` function) → Storybook auto-generates clean JSX from the args. ✅ Always preferred.
- Stories using a `render` function → Storybook shows the raw render function source, including `() => {`, `useState`, and all wrapper elements. ❌ Never acceptable for docs-referenced stories.

### Fix A — Stateless stories: convert to args pattern

Remove the `render` function entirely. Storybook derives clean JSX automatically.

```tsx
// ❌ Before — "Show Code" displays the render function source
export const Disabled: Story = {
  render: () => <Input disabled placeholder="Disabled" />,
};

// ✅ After — "Show Code" displays <Input disabled placeholder="Disabled" />
export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled' },
};
```

### Fix B — Stateful stories: keep render, add source.code override

When a story requires `useState` or other hooks, keep `render` but add a `parameters.docs.source.code` override with the clean developer-facing snippet.

```tsx
export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <Input value={value} onChange={setValue} placeholder="Type…" />;
  },
  parameters: {
    docs: {
      source: {
        code: `
const [value, setValue] = useState('');

<Input value={value} onChange={setValue} placeholder="Type…" />
        `.trim(),
      },
    },
  },
};
```

The `source.code` string should look like what a developer would copy into their app — no `render: () =>` wrapper, no debug `<Text>Value: {value}</Text>` helpers, just the state declaration(s) + the JSX.

### Scope

This rule applies **only** to stories referenced in `<Canvas>` blocks in `.docs.mdx` files. `AllStates`, `SizeComparison`, `IconAlignment`, and other QA/comparison stories that are not in docs are **exempt**.

---

## Forbidden Patterns

- Do not import from `@cre/web-ui/src/...` — always import from `@cre/web-ui` (the package).
- Do not use hardcoded colors or sizes in story args or story wrapper styles. Use design tokens if custom styling is needed.
- Do not add a story for a component that does not yet exist in `@cre/web-ui`.
