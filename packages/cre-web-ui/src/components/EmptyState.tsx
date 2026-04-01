import React from 'react';
import { Stack } from '../primitives/Stack';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';

export type EmptyStateProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function EmptyState({ title, description, actions, className, style }: EmptyStateProps) {
  return (
    <Stack gap="nano" className={className} style={style}>
      <Heading level={4}>{title}</Heading>
      {description ? (
        <Text as="p" tone="muted">
          {description}
        </Text>
      ) : null}
      {actions ? <div>{actions}</div> : null}
    </Stack>
  );
}
