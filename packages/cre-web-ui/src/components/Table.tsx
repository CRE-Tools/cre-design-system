import React, { useMemo, useState } from 'react';
import { injectStyles } from '../internal/injectStyles';
import { Box } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Checkbox } from './Checkbox';

const TABLE_CSS = `
[data-cre="tableWrap"] {
  width: 100%;
  overflow: auto;
  border-radius: var(--cre-radius-small);
  border-width: var(--cre-border-width-small);
  border-style: solid;
  border-color: var(--cre-color-border);
  box-sizing: border-box;
}

[data-cre="table"] {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--cre-font-family-body);
  font-size: var(--cre-font-size-tiny);
  color: var(--cre-color-text);
}

[data-cre="th"] {
  text-align: left;
  font-size: var(--cre-font-size-micro);
  font-weight: 600;
  color: var(--cre-accent-fg);
  padding: var(--cre-space-nano) var(--cre-space-micro);
  border-bottom: var(--cre-border-width-small) solid var(--cre-accent-border);
  background: var(--cre-accent-bg);
  position: sticky;
  top: 0;
}

[data-cre="td"] {
  padding: var(--cre-space-nano) var(--cre-space-micro);
  border-bottom: var(--cre-border-width-small) solid var(--cre-color-border);
  background: var(--cre-color-surface);
}

[data-cre="tr"][data-clickable="true"] {
  cursor: pointer;
}

[data-cre="tr"][data-clickable="true"]:hover [data-cre="td"] {
  background: var(--cre-color-bg);
}

[data-cre="thButton"] {
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--cre-space-quark);
}

[data-cre="emptyCell"] {
  padding: var(--cre-space-micro);
}
`;

injectStyles('cre-table-styles', TABLE_CSS);

export type TableSortDirection = 'asc' | 'desc';

export type TableColumn<Row> = {
  key: string;
  header: React.ReactNode;
  width?: number | string;
  render?: (row: Row) => React.ReactNode;
  sort?: (a: Row, b: Row) => number;
};

export type TableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  getRowId?: (row: Row, index: number) => string;
  onRowClick?: (row: Row) => void;
  selectableRows?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
  emptyState?: React.ReactNode;
  sortable?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export function Table<Row>({
  columns,
  rows,
  getRowId,
  onRowClick,
  selectableRows = false,
  selectedRowIds,
  defaultSelectedRowIds,
  onSelectedRowIdsChange,
  emptyState,
  sortable = true,
  className,
  style,
}: TableProps<Row>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<TableSortDirection>('asc');
  const [internalSelected, setInternalSelected] = useState<string[]>(defaultSelectedRowIds ?? []);

  const effectiveSelected = selectedRowIds ?? internalSelected;
  const setSelected = (ids: string[]) => {
    onSelectedRowIdsChange?.(ids);
    if (selectedRowIds == null) setInternalSelected(ids);
  };

  const sortedRows = useMemo(() => {
    if (!sortable || !sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sort) return rows;
    const copy = [...rows];
    copy.sort((a, b) => (sortDir === 'asc' ? col.sort!(a, b) : -col.sort!(a, b)));
    return copy;
  }, [rows, columns, sortKey, sortDir, sortable]);

  const isEmpty = sortedRows.length === 0;

  const resolvedGetRowId = (row: Row, index: number) => getRowId?.(row, index) ?? String(index);

  const allIds = selectableRows ? sortedRows.map((r, i) => resolvedGetRowId(r, i)) : [];
  const allSelected = selectableRows && allIds.length > 0 && allIds.every((id) => effectiveSelected.includes(id));
  const someSelected = selectableRows && allIds.some((id) => effectiveSelected.includes(id));

  return (
    <Box as="div" data-cre="tableWrap" className={className} style={style}>
      <table data-cre="table">
        <thead>
          <tr>
            {selectableRows ? (
              <th data-cre="th" style={{ width: 40 }}>
                <Checkbox
                  ariaLabel="Select all rows"
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onChange={(next) => {
                    setSelected(next ? allIds : []);
                  }}
                />
              </th>
            ) : null}
            {columns.map((c) => {
              const canSort = sortable && !!c.sort;
              const active = sortKey === c.key;
              const label = typeof c.header === 'string' ? c.header : undefined;

              return (
                <th key={c.key} data-cre="th" style={{ width: c.width }}>
                  {canSort ? (
                    <button
                      type="button"
                      data-cre="thButton"
                      aria-label={label ? `Sort by ${label}` : undefined}
                      onClick={() => {
                        if (!active) {
                          setSortKey(c.key);
                          setSortDir('asc');
                          return;
                        }
                        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                      }}
                    >
                      {c.header}
                      {active ? <Text as="span">{sortDir === 'asc' ? '↑' : '↓'}</Text> : null}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td data-cre="emptyCell" colSpan={columns.length + (selectableRows ? 1 : 0)}>
                {emptyState ?? (
                  <Text as="p" tone="muted">
                    No results.
                  </Text>
                )}
              </td>
            </tr>
          ) : (
            sortedRows.map((row, i) => {
              const rowId = resolvedGetRowId(row, i);
              const checked = selectableRows ? effectiveSelected.includes(rowId) : false;
              return (
                <tr
                  key={rowId}
                  data-cre="tr"
                  data-clickable={onRowClick ? 'true' : 'false'}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectableRows ? (
                    <td data-cre="td">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={checked}
                          onChange={(nextChecked) => {
                            const next = nextChecked
                              ? [...effectiveSelected, rowId]
                              : effectiveSelected.filter((id) => id !== rowId);
                            setSelected(next);
                          }}
                        />
                      </div>
                    </td>
                  ) : null}
                  {columns.map((c) => (
                    <td key={c.key} data-cre="td">
                      {c.render ? c.render(row) : (row as any)?.[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </Box>
  );
}
