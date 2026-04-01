/**
 * Button.tsx
 *
 * Primary button component for the CRE design system.
 *
 * All visual values come exclusively from CSS custom properties set by
 * CreThemeProvider. The component never references raw hex values or raw
 * palette token keys directly.
 *
 * Size variants work by locally overriding the --cre-button-* CSS vars on
 * the element itself via [data-size] attribute selectors. Because those same
 * vars are already used throughout the base styles (padding, gap, radius,
 * icon slot, typography), the override cascades automatically with no
 * additional JS.
 *
 *   vr      — 24px font / 16×20 padding / 12px radius  (VR / extra-large)
 *   large   — 16px font / 12×16 padding /  8px radius  (desktop large)
 *   regular — 15px font /  8×16 padding /  8px radius / 40px height (default)
 *
 * Hover / active states are CSS pseudo-classes; focus uses :focus-visible.
 */

import React, { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { Box } from '../primitives/Box';
import { IconSlot } from '../primitives/IconSlot';

// ─── Singleton style injection ────────────────────────────────────────────────

const BUTTON_CSS = `
[data-cre="button"] {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--cre-button-gap);
  padding: var(--cre-button-padding-y) var(--cre-button-padding-x);
  border-radius: var(--cre-button-radius);
  border-width: var(--cre-border-width-small);
  border-style: solid;
  background: var(--cre-button-bg);
  color: var(--cre-button-fg);
  border-color: var(--cre-button-border);
  font-family: var(--cre-font-family-button);
  font-size: var(--cre-button-font-size);
  font-weight: var(--cre-button-font-weight);
  line-height: var(--cre-button-line-height);
  font-style: normal;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  box-sizing: border-box;
  outline: none;
  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    box-shadow 120ms ease;
}

/* ── Size variants: locally override the --cre-button-* vars ─────────────── */
/* vr is the base (no override needed — uses coreTokensToCssVars defaults)   */

/* large — desktop primary action */
[data-cre="button"][data-size="large"] {
  --cre-button-padding-y:    var(--cre-space-pico);    /* 12px */
  --cre-button-padding-x:    var(--cre-space-micro);   /* 16px */
  --cre-button-gap:          var(--cre-space-pico);    /* 12px */
  --cre-button-radius:       var(--cre-radius-xsmall); /*  8px */
  --cre-button-icon-size:    20px;
  --cre-button-icon-padding: 2.5px;
  /* TODO: alias to core font-size token once full typography scale is mapped */
  --cre-button-font-size:    16px;
  --cre-button-font-weight:  500;
  --cre-button-line-height:  24px;
}

/* regular — standard web button (default size) */
[data-cre="button"][data-size="regular"] {
  --cre-button-padding-y:    var(--cre-space-nano);    /*  8px */
  --cre-button-padding-x:    var(--cre-space-micro);   /* 16px */
  --cre-button-gap:          var(--cre-space-nano);    /*  8px */
  --cre-button-radius:       var(--cre-radius-xsmall); /*  8px */
  --cre-button-icon-size:    20px;
  --cre-button-icon-padding: 2.5px;
  /* font-size 15px = core typography.font-size.tiny */
  --cre-button-font-size:    15px;
  --cre-button-font-weight:  500;
  --cre-button-line-height:  24px;
  height: 40px;
}

/* ── Interactive states ───────────────────────────────────────────────────── */

[data-cre="button"]:not(:disabled):hover {
  background:   var(--cre-button-hover-bg);
  color:        var(--cre-button-hover-fg);
  border-color: var(--cre-button-hover-border);
}

[data-cre="button"]:not(:disabled):active {
  background:   var(--cre-button-active-bg);
  color:        var(--cre-button-active-fg);
  border-color: var(--cre-button-active-border);
}

[data-cre="button"]:focus-visible {
  box-shadow: 0 0 0 3px var(--cre-color-focus);
}

[data-cre="button"]:disabled {
  background:   var(--cre-button-disabled-bg);
  color:        var(--cre-button-disabled-fg);
  border-color: var(--cre-button-disabled-border);
  cursor: not-allowed;
}
`;

function injectButtonStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('cre-button-styles')) return;
  const el = document.createElement('style');
  el.id = 'cre-button-styles';
  el.textContent = BUTTON_CSS;
  document.head.appendChild(el);
}

injectButtonStyles();

// ─── Public API ───────────────────────────────────────────────────────────────

/** Button size variant. Affects padding, gap, radius, icon size, and typography. */
export type CreButtonSize = 'regular' | 'large' | 'vr';

export type CreButtonProps = {
  /** Button label content. */
  children?: ReactNode;
  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;
  /**
   * Size variant.
   * - `regular` — 15px / 8×16 padding / 8px radius / 40px height  (default)
   * - `large`   — 16px / 12×16 padding / 8px radius
   * - `vr`      — 24px / 16×20 padding / 12px radius  (VR / extra-large)
   */
  size?: CreButtonSize;
  /** Disables the button and applies disabled token colors. */
  disabled?: boolean;
  /** HTML button type. Defaults to "button". */
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /** Additional CSS class name(s) for layout or composition overrides. */
  className?: string;
  onClick?: () => void;
};

export function Button({
  children,
  leadingIcon,
  trailingIcon,
  size = 'regular',
  disabled,
  type = 'button',
  className,
  onClick,
}: CreButtonProps) {
  return (
    <Box
      as="button"
      data-cre="button"
      data-size={size}
      type={type}
      disabled={disabled}
      className={className}
      onClick={disabled ? undefined : onClick}
    >
      <IconSlot>{leadingIcon}</IconSlot>
      {children}
      <IconSlot>{trailingIcon}</IconSlot>
    </Box>
  );
}
