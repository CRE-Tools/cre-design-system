import React from 'react';
import { injectStyles } from '../internal/injectStyles';
import { Box } from '../primitives/Box';

const SELECT_CSS = `
[data-cre="select"] {
  height: 40px;
  padding: 0 var(--cre-space-nano);
  border-radius: var(--cre-radius-xsmall);
  border-width: var(--cre-border-width-small);
  border-style: solid;
  border-color: var(--cre-color-border);
  background: var(--cre-color-surface);
  color: var(--cre-color-text);
  font-family: var(--cre-font-family-body);
  font-size: var(--cre-font-size-tiny);
  outline: none;
  box-sizing: border-box;
}

[data-cre="select"]:focus-visible {
  box-shadow: 0 0 0 3px var(--cre-color-focus);
  border-color: var(--cre-color-border-strong);
}

[data-cre="select"][disabled] {
  cursor: not-allowed;
  opacity: var(--cre-opacity-opaque);
}
`;

injectStyles('cre-select-styles', SELECT_CSS);

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function Select({
  options,
  value,
  defaultValue,
  placeholder,
  disabled,
  onChange,
  id,
  name,
  className,
  style,
}: SelectProps) {
  return (
    <Box
      as="select"
      data-cre="select"
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      className={className}
      style={style}
      onChange={(e) => onChange?.(e.currentTarget.value)}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </Box>
  );
}
