---
id: TASK-004
title: Input — add type, hasError, and password visibility toggle
status: done
model: medium
model-name: GPT-5.2
context:
  - docs/context/component-patterns.md
  - docs/context/token-system.md
  - packages/cre-web-ui/AGENTS.md
  - apps/storybook/AGENTS.md
doc-impact:
  - apps/storybook/src/stories/web/components/Input/Input.docs.mdx
---

## Description

Extend the `Input` component to support three new capabilities needed for a login page:

1. **`type` prop** — first-class `'text' | 'email' | 'password'` (default `'text'`). Replace the current `inputProps.type` passthrough with an explicit prop, and add `'type'` to the `Omit` list of `inputProps` so it cannot be set there.

2. **`hasError` prop** — `boolean` that flips the border and focus ring to error colors. Visual only — no message rendering (that stays in `Field`). Implemented via `data-error` attribute on the root.

3. **Password visibility toggle** — when `type="password"` and no custom `trailing` is provided, auto-render an eye/eye-off toggle button inside the trailing slot. The component manages `showPassword` internal state. When `showPassword` is true, the actual `<input>` receives `type="text"`.

Also fix a standing rule violation: the component must use `React.forwardRef` (ref forwarded to the inner `<input>` element), as required by `packages/cre-web-ui/AGENTS.md`.

Finally, update stories and docs for coherence (see Acceptance Criteria below).

---

## Acceptance Criteria

### Component (`packages/cre-web-ui/src/components/Input.tsx`)

- [ ] `type?: 'text' | 'email' | 'password'` added to `InputProps`. Default is `'text'`.
- [ ] `'type'` added to the `Omit` list in `inputProps` so it cannot be double-set.
- [ ] `hasError?: boolean` added to `InputProps`.
- [ ] `data-error="true"` set on `[data-cre="inputRoot"]` when `hasError` is true (use `"false"` otherwise, matching the existing `data-disabled` pattern).
- [ ] Error CSS: `[data-cre="inputRoot"][data-error="true"]` uses `border-color: var(--cre-feedback-error-border)` and the focus ring uses `box-shadow: 0 0 0 var(--cre-border-width-medium) var(--cre-feedback-error-border)`.
- [ ] When `type="password"` and `trailing` is not provided, Input renders an eye/eye-off toggle button in the trailing slot.
- [ ] The toggle button uses `[data-cre="inputPasswordToggle"]` and is styled via the existing `INPUT_CSS` block (no hardcoded values — use `var(--cre-color-text-subtle)` for default, `var(--cre-color-text)` on hover).
- [ ] Password toggle uses two inline SVG icons (eye / eye-off). Keep them simple (stroke-only, 18×18, `currentColor`).
- [ ] When `type="password"` and a custom `trailing` is provided, the custom trailing wins (no auto-toggle).
- [ ] Component uses `React.forwardRef<HTMLInputElement, InputProps>` with ref forwarded to `<input>`.
- [ ] `Input.displayName = 'Input'` preserved.

### Stories (`apps/storybook/src/stories/web/components/Input/Input.stories.tsx`)

- [ ] Add `EmailField` story: wraps Input in Field, `type="email"`, validates on blur (checks `value.includes('@')`), passes `error` to Field and `hasError` to Input when invalid.
- [ ] Add `PasswordField` story: Input with `type="password"`, showing the built-in eye toggle.
- [ ] Add `WithError` story: Input with `hasError={true}` and a static placeholder, no Field wrapper (pure visual state demo).
- [ ] Update `AllStates` to include an error-state row, an email row, and a password row.
- [ ] Add `EmailField` and `PasswordField` and `WithError` to `argTypes`/`args` where appropriate (they are render stories so no args needed, but declare them in meta if needed for controls).

### Docs (`apps/storybook/src/stories/web/components/Input/Input.docs.mdx`)

- [ ] Replace the "With Field" code-only section at the bottom with a real `<Canvas of={InputStories.EmailField} />` under a new "Email input" heading. Add a brief note that `type="email"` provides native format validation and the consumer drives `hasError`/`error` via controlled state.
- [ ] Add a "Password input" section with `<Canvas of={InputStories.PasswordField} />` and a note explaining the auto-toggle behavior.
- [ ] Add an "Error state" section with `<Canvas of={InputStories.WithError} />` and a note that `hasError` controls visual state only — pair it with `Field`'s `error` prop for the message.
- [ ] All other existing sections (Basic, With leading and trailing, Disabled, Props/Playground) remain unchanged.
- [ ] The doc flows coherently — no dead code-only blocks, no forward references to stories that don't exist.

---

## Relevant Data

### Current `InputProps` signature (to be updated)

```tsx
export type InputProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onChange?: (value: string) => void;
  id?: string;
  name?: string;
  autoComplete?: string;
  className?: string;
  style?: React.CSSProperties;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'onChange' | 'id' | 'name' | 'autoComplete'>;
};
```

### Target `InputProps` shape

```tsx
export type InputProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password';
  hasError?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onChange?: (value: string) => void;
  id?: string;
  name?: string;
  autoComplete?: string;
  className?: string;
  style?: React.CSSProperties;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'onChange' | 'id' | 'name' | 'autoComplete' | 'type'>;
};
```

### CSS vars available for error state

```css
--cre-feedback-error-border   /* border color */
--cre-feedback-error-text     /* text/icon color */
--cre-feedback-error-bg       /* tinted background (not needed here) */
--cre-border-width-medium     /* focus ring width */
--cre-color-text-subtle       /* toggle icon default */
--cre-color-text              /* toggle icon hover */
```

### Error CSS additions to `INPUT_CSS`

```css
[data-cre="inputRoot"][data-error="true"] {
  border-color: var(--cre-feedback-error-border);
}

[data-cre="inputRoot"][data-error="true"]:focus-within {
  box-shadow: 0 0 0 var(--cre-border-width-medium) var(--cre-feedback-error-border);
  border-color: var(--cre-feedback-error-border);
}

[data-cre="inputPasswordToggle"] {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--cre-color-text-subtle);
  line-height: 0;
}

[data-cre="inputPasswordToggle"]:hover {
  color: var(--cre-color-text);
}
```

### Password toggle logic sketch

```tsx
function Input({ type = 'text', trailing, hasError, ...rest }, ref) {
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = type === 'password' && showPassword ? 'text' : type;

  const resolvedTrailing =
    type === 'password' && !trailing
      ? (
          <button
            type="button"
            data-cre="inputPasswordToggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )
      : trailing;

  return (
    <Box as="div" data-cre="inputRoot" data-disabled={...} data-error={hasError ? 'true' : 'false'}>
      {leading ? <IconSlot>{leading}</IconSlot> : null}
      <input
        ref={ref}
        data-cre="input"
        type={resolvedType}
        ...
      />
      {resolvedTrailing ? <IconSlot>{resolvedTrailing}</IconSlot> : null}
    </Box>
  );
}
```

Note: The toggle button should NOT be wrapped in `IconSlot` since it is interactive — just render it directly as the trailing child inside the existing trailing `IconSlot`.

Actually reconsider: the current pattern is `{trailing ? <IconSlot>{trailing}</IconSlot> : null}`. If the toggle button is passed as `resolvedTrailing`, it goes into `IconSlot` as its child, which is fine — `IconSlot` is just a sizing/centering wrapper. Keep the existing pattern unchanged.

### EmailField story sketch

```tsx
export const EmailField: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleBlur = () => {
      if (value && !value.includes('@')) {
        setError('Enter a valid email address');
      } else {
        setError('');
      }
    };

    return (
      <Field label="Email" htmlFor="email" error={error || undefined}>
        <Input
          id="email"
          type="email"
          value={value}
          onChange={setValue}
          hasError={!!error}
          placeholder="you@example.com"
          autoComplete="email"
          inputProps={{ onBlur: handleBlur }}
        />
      </Field>
    );
  },
};
```

### File paths to modify

- `packages/cre-web-ui/src/components/Input.tsx`
- `apps/storybook/src/stories/web/components/Input/Input.stories.tsx`
- `apps/storybook/src/stories/web/components/Input/Input.docs.mdx`

No new files needed. No exports to add (Input is already exported from `src/index.ts`).
