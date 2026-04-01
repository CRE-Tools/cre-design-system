import React from 'react';
import { Inline } from '../primitives/Inline';

export type ControlsRowProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  gap?: React.ComponentProps<typeof Inline>['gap'];
  wrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function ControlsRow({ left, right, gap = 'micro', wrap = true, className, style }: ControlsRowProps) {
  return (
    <Inline
      gap={gap}
      wrap={wrap}
      align="center"
      justify="space-between"
      className={className}
      style={{ width: '100%', ...style }}
    >
      <Inline gap="nano" wrap={wrap} align="center">
        {left}
      </Inline>
      <Inline gap="nano" wrap={wrap} align="center">
        {right}
      </Inline>
    </Inline>
  );
}
