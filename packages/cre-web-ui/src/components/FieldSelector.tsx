import React, { useEffect, useRef, useState } from 'react';
import { injectStyles } from '../internal/injectStyles';
import { defaultLabelParser, flattenFields } from '../internal/fieldUtils';
import { Box } from '../primitives/Box';
import { Stack } from '../primitives/Stack';
import { Surface } from '../primitives/Surface';
import { Text } from '../primitives/Text';
import { Checkbox } from './Checkbox';

const FIELD_SELECTOR_CSS = `
[data-cre="fieldSelectorRoot"] {
  position: relative;
  display: inline-flex;
}

[data-cre="fieldSelectorTrigger"] {
  appearance: none;
  border: var(--cre-border-width-small) solid var(--cre-color-border);
  background: var(--cre-color-surface);
  color: var(--cre-color-text);
  border-radius: var(--cre-radius-xsmall);
  width: 40px;
  height: 40px;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  outline: none;
}

[data-cre="fieldSelectorTrigger"][data-open="true"] {
  border-color: var(--cre-color-border-strong);
  box-shadow: 0 0 0 3px var(--cre-color-focus);
}

[data-cre="fieldSelectorTrigger"]:focus-visible {
  box-shadow: 0 0 0 3px var(--cre-color-focus);
  border-color: var(--cre-color-border-strong);
}

[data-cre="fieldSelectorPopover"] {
  position: absolute;
  top: calc(100% + var(--cre-space-nano));
  right: 0;
  z-index: 20;
  min-width: 200px;
  max-width: 280px;
  transform-origin: top right;
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

[data-cre="fieldSelectorPopover"][data-state="closed"] {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
  pointer-events: none;
}

[data-cre="fieldSelectorPopover"][data-state="open"] {
  opacity: 1;
  transform: translateY(0) scale(1);
}

[data-cre="fieldSelectorItem"] {
  display: flex;
  align-items: center;
  gap: var(--cre-space-nano);
  padding: var(--cre-space-quark) 0;
}
`;

injectStyles('cre-field-selector-styles', FIELD_SELECTOR_CSS);

export type FieldSelectorProps = {
  /**
   * Row data used to auto-derive the field list via flattenFields.
   * Ignored when fields is provided explicitly.
   */
  data?: Record<string, unknown>[];
  /**
   * Explicit list of field paths. When provided, data is not used for
   * field derivation (though it may still be passed for future use).
   */
  fields?: string[];
  /** Currently visible field paths. */
  visibleFields: string[];
  /** Called when the user toggles a field. */
  onVisibleFieldsChange: (fields: string[]) => void;
  /**
   * Custom label parser. Receives a dot-path (e.g. "address.city") and
   * returns a display label. Defaults to defaultLabelParser.
   */
  labelParser?: (path: string) => string;
  /** Accessible label for the trigger button. */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

function ColumnsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="4" width="5" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.5" y="4" width="5" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="16" y="4" width="5" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function FieldSelector({
  data,
  fields: fieldsProp,
  visibleFields,
  onVisibleFieldsChange,
  labelParser,
  ariaLabel = 'Select visible columns',
  className,
  style,
}: FieldSelectorProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const resolveLabelParser = labelParser ?? defaultLabelParser;

  const allFields: string[] = fieldsProp ?? (data ? flattenFields(data) : []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const t = window.setTimeout(() => setMounted(false), 140);
    return () => window.clearTimeout(t);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;

    function onMouseDown(e: MouseEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && root.contains(e.target)) return;
      setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggle = (field: string, checked: boolean) => {
    const next = checked
      ? [...visibleFields, field]
      : visibleFields.filter((f) => f !== field);
    onVisibleFieldsChange(next);
  };

  return (
    <div data-cre="fieldSelectorRoot" ref={rootRef} className={className} style={style}>
      <button
        ref={triggerRef}
        type="button"
        data-cre="fieldSelectorTrigger"
        data-open={open ? 'true' : 'false'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <ColumnsIcon />
      </button>

      {mounted ? (
        <div
          data-cre="fieldSelectorPopover"
          data-state={open ? 'open' : 'closed'}
          role="dialog"
          aria-modal="false"
          aria-label="Column visibility"
        >
          <Surface variant="raised" padding="micro" radius="small">
            <Stack gap="quark">
              <Text as="div" variant="label">
                Columns
              </Text>
              {allFields.length === 0 ? (
                <Text as="p" tone="muted">
                  No fields available.
                </Text>
              ) : (
                allFields.map((field) => (
                  <Box key={field} as="div" data-cre="fieldSelectorItem">
                    <Checkbox
                      id={`field-selector-${field}`}
                      checked={visibleFields.includes(field)}
                      label={resolveLabelParser(field)}
                      onChange={(checked) => toggle(field, checked)}
                    />
                  </Box>
                ))
              )}
            </Stack>
          </Surface>
        </div>
      ) : null}
    </div>
  );
}
FieldSelector.displayName = 'FieldSelector';
