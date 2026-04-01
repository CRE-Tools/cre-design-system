import React, { useEffect } from 'react';
import { injectStyles } from '../internal/injectStyles';
import { Surface } from '../primitives/Surface';
import { Stack } from '../primitives/Stack';
import { Inline } from '../primitives/Inline';
import { Heading } from '../primitives/Heading';
import { Box } from '../primitives/Box';

const DRAWER_CSS = `
[data-cre="drawerOverlay"] {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--cre-color-text) 40%, transparent);
  display: flex;
  justify-content: flex-end;
  padding: 0;
  z-index: 1000;
}

[data-cre="drawerPanel"] {
  width: min(420px, 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
}

[data-cre="drawerBody"] {
  overflow: auto;
}
`;

injectStyles('cre-drawer-styles', DRAWER_CSS);

export type DrawerProps = {
  open: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  dismissible?: boolean;
  className?: string;
};

export function Drawer({ open, title, children, footer, onClose, dismissible = true, className }: DrawerProps) {
  const titleId = typeof title === 'string' ? 'cre-drawer-title' : undefined;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && dismissible) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, dismissible]);

  if (!open) return null;

  return (
    <Box
      as="div"
      data-cre="drawerOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        if (!dismissible) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Surface data-cre="drawerPanel" variant="raised" className={className} padding="micro" radius="none" style={{ borderTop: 0, borderRight: 0, borderBottom: 0 }}>
        <Stack gap="micro" style={{ minHeight: 0 }}>
          {title != null ? (
            <Inline align="center" justify="space-between">
              {typeof title === 'string' ? <Heading level={4} id={titleId}>{title}</Heading> : title}
            </Inline>
          ) : null}
          <Box as="div" data-cre="drawerBody" style={{ minHeight: 0 }}>
            {children}
          </Box>
          {footer != null ? <Box as="div">{footer}</Box> : null}
        </Stack>
      </Surface>
    </Box>
  );
}
