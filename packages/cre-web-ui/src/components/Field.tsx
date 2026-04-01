import React from 'react';
import { Stack } from '../primitives/Stack';
import { Text } from '../primitives/Text';

export type FieldProps = {
  label: string;
  description?: string;
  error?: string;
  children?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function Field({
  label,
  description,
  error,
  children,
  htmlFor,
  required,
  className,
  style,
}: FieldProps) {
  return (
    <Stack gap="quark" className={className} style={style}>
      <Text as="label" variant="label" htmlFor={htmlFor}>
        {label}
        {required ? <span style={{ color: 'var(--cre-feedback-error-text)' }}> *</span> : null}
      </Text>
      {description ? (
        <Text as="p" variant="caption" tone="muted">
          {description}
        </Text>
      ) : null}
      <div>{children}</div>
      {error ? (
        <Text as="p" variant="caption" style={{ color: 'var(--cre-feedback-error-text)' }}>
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}
