import React from 'react';
import { Inline } from '../primitives/Inline';
import { Text } from '../primitives/Text';
import { Button } from './Button';

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  style?: React.CSSProperties;
};

export function Pagination({ page, totalPages, onPageChange, className, style }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <Inline gap="nano" align="center" className={className} style={style}>
      <Button disabled={!canPrev} onClick={() => (canPrev ? onPageChange(page - 1) : null)}>
        Previous
      </Button>
      <Text as="span" tone="muted">
        Page {page} of {totalPages}
      </Text>
      <Button disabled={!canNext} onClick={() => (canNext ? onPageChange(page + 1) : null)}>
        Next
      </Button>
    </Inline>
  );
}
