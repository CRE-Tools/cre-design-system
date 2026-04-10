import React from 'react';
import { injectStyles } from '../internal/injectStyles';
import { Box } from '../primitives/Box';
import { IconSlot } from '../primitives/IconSlot';

const INPUT_CSS = `
[data-cre="inputRoot"] {
  --cre-input-height: 40px;
  --cre-input-padding-x: var(--cre-space-nano);
  --cre-input-radius: var(--cre-radius-xsmall);

  display: inline-flex;
  align-items: center;
  gap: var(--cre-space-nano);
  height: var(--cre-input-height);
  padding: 0 var(--cre-input-padding-x);
  border-radius: var(--cre-input-radius);
  border-width: var(--cre-border-width-small);
  border-style: solid;
  border-color: var(--cre-color-border);
  background: var(--cre-color-surface);
  box-sizing: border-box;
}

[data-cre="inputRoot"][data-disabled="true"] {
  opacity: var(--cre-opacity-opaque);
}

[data-cre="input"] {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--cre-color-text);
  font-family: var(--cre-font-family-body);
  font-size: var(--cre-font-size-tiny);
}

[data-cre="input"]::placeholder {
  color: var(--cre-color-text-subtle);
}

[data-cre="inputRoot"]:focus-within {
  box-shadow: 0 0 0 var(--cre-border-width-medium) var(--cre-color-focus);
  border-color: var(--cre-color-border-strong);
}

[data-cre="input"][disabled] {
  cursor: not-allowed;
}
`;

injectStyles('cre-input-styles', INPUT_CSS);

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
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'onChange' | 'id' | 'name' | 'autoComplete'>;
};

export function Input({
  value,
  defaultValue,
  placeholder,
  disabled,
  leading,
  trailing,
  onChange,
  id,
  name,
  autoComplete,
  className,
  style,
  inputProps,
}: InputProps) {
  return (
    <Box as="div" data-cre="inputRoot" data-disabled={disabled ? 'true' : 'false'} className={className} style={style}>
      {leading ? <IconSlot>{leading}</IconSlot> : null}
      <input
        data-cre="input"
        id={id}
        name={name}
        autoComplete={autoComplete}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        {...inputProps}
      />
      {trailing ? <IconSlot>{trailing}</IconSlot> : null}
    </Box>
  );
}
Input.displayName = 'Input';
