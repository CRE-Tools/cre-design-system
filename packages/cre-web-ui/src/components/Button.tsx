import React, { useMemo, useState } from 'react';

export type CreButtonStateColors = {
  normal?: {
    background?: string;
    color?: string;
    borderColor?: string;
  };
  hover?: {
    background?: string;
    color?: string;
    borderColor?: string;
  };
  active?: {
    background?: string;
    color?: string;
    borderColor?: string;
  };
  disabled?: {
    background?: string;
    color?: string;
    borderColor?: string;
  };
};

export type CreButtonProps = {
  text: string;
  disabled?: boolean;
  padding?: number | string;
  colors?: CreButtonStateColors;
  onClick?: () => void;
};

function toPadding(padding: number | string | undefined): string {
  if (padding === undefined) return '10px 14px';
  return typeof padding === 'number' ? `${padding}px` : padding;
}

export function Button({ text, disabled, padding, colors, onClick }: CreButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const state: 'disabled' | 'active' | 'hover' | 'normal' = disabled
    ? 'disabled'
    : active
      ? 'active'
      : hovered
        ? 'hover'
        : 'normal';

  const style = useMemo<React.CSSProperties>(() => {
    const vars: React.CSSProperties = {
      padding: toPadding(padding),
      background:
        state === 'disabled'
          ? (colors?.disabled?.background ?? 'var(--cre-button-disabled-bg)')
          : state === 'active'
            ? (colors?.active?.background ?? 'var(--cre-button-active-bg)')
            : state === 'hover'
              ? (colors?.hover?.background ?? 'var(--cre-button-hover-bg)')
              : (colors?.normal?.background ?? 'var(--cre-button-bg)'),
      color:
        state === 'disabled'
          ? (colors?.disabled?.color ?? 'var(--cre-button-disabled-fg)')
          : state === 'active'
            ? (colors?.active?.color ?? 'var(--cre-button-active-fg)')
            : state === 'hover'
              ? (colors?.hover?.color ?? 'var(--cre-button-hover-fg)')
              : (colors?.normal?.color ?? 'var(--cre-button-fg)'),
      borderColor:
        state === 'disabled'
          ? (colors?.disabled?.borderColor ?? 'var(--cre-button-disabled-border)')
          : state === 'active'
            ? (colors?.active?.borderColor ?? 'var(--cre-button-active-border)')
            : state === 'hover'
              ? (colors?.hover?.borderColor ?? 'var(--cre-button-hover-border)')
              : (colors?.normal?.borderColor ?? 'var(--cre-button-border)')
    };

    return vars;
  }, [colors, padding, state]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...style,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '20px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease',
        userSelect: 'none'
      }}
    >
      {text}
    </button>
  );
}
