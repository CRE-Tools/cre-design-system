/**
 * DesignTokens.stories.tsx
 *
 * Visual token reference for the CRE design system.
 * Uses the raw token values exported from @cre/web-ui so every swatch
 * reflects exactly what is in the Figma JSON source files.
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  coreTokens,
  lightColorTokens,
  darkColorTokens,
  useCreTheme,
} from '@cre/web-ui';
import type { ColorTokens } from '@cre/web-ui';

// ─── Shared mini-components ───────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: 'var(--cre-font-family-heading)',
        fontSize: 20,
        fontWeight: 600,
        color: 'var(--cre-color-text)',
        marginBottom: 16,
        paddingBottom: 8,
        borderBottom: '1px solid var(--cre-color-border)',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TokenRow({ label, value, preview }: { label: string; value: string; preview?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      {preview}
      <code style={{
        fontFamily: 'monospace',
        fontSize: 12,
        color: 'var(--cre-color-text-muted)',
        minWidth: 260,
      }}>
        {label}
      </code>
      <span style={{ fontSize: 13, color: 'var(--cre-color-text-subtle)' }}>{value}</span>
    </div>
  );
}

// ─── Color swatches ───────────────────────────────────────────────────────────

function ColorSwatch({ color, name, step }: { color: string; name: string; step: string | number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--cre-radius-xsmall)',
        background: color,
        border: '1px solid var(--cre-color-border)',
      }} />
      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--cre-color-text-muted)' }}>
        {step}
      </span>
      <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--cre-color-text-subtle)' }}>
        {color}
      </span>
    </div>
  );
}

function PaletteRow({ name, colors }: { name: string; colors: Record<string | number, string> }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--cre-color-text)',
        marginBottom: 8,
        textTransform: 'capitalize',
      }}>
        {name}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(colors).map(([step, hex]) => (
          <ColorSwatch key={step} color={hex} name={name} step={step} />
        ))}
      </div>
    </div>
  );
}

// ─── Spacing / radius visual bars ────────────────────────────────────────────

function SpaceBar({ name, px }: { name: string; px: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--cre-color-text-muted)', width: 100 }}>
        {name}
      </code>
      <div style={{
        height: 16,
        width: Math.min(px, 320),
        background: 'var(--cre-color-surface-raised)',
        border: '1px solid var(--cre-color-border)',
        borderRadius: 2,
        flexShrink: 0,
      }} />
      <span style={{ fontSize: 12, color: 'var(--cre-color-text-subtle)' }}>{px}px</span>
    </div>
  );
}

function RadiusSwatch({ name, px }: { name: string; px: number }) {
  const displayPx = Math.min(px, 48);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 56,
        height: 56,
        background: 'var(--cre-color-surface-raised)',
        border: '1px solid var(--cre-color-border)',
        borderRadius: displayPx,
      }} />
      <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--cre-color-text-muted)' }}>{name}</span>
      <span style={{ fontSize: 10, color: 'var(--cre-color-text-subtle)' }}>{px >= 9999 ? 'pill' : `${px}px`}</span>
    </div>
  );
}

// ─── Story component ──────────────────────────────────────────────────────────

function TokenReference() {
  const { mode } = useCreTheme();
  const colors: ColorTokens = mode === 'dark' ? darkColorTokens : lightColorTokens;

  return (
    <div style={{
      background: 'var(--cre-color-bg)',
      color: 'var(--cre-color-text)',
      fontFamily: 'var(--cre-font-family-body)',
      padding: 32,
      minHeight: '100vh',
    }}>
      <h1 style={{
        fontFamily: 'var(--cre-font-family-heading)',
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 8,
        color: 'var(--cre-color-text)',
      }}>
        Design Tokens
      </h1>
      <p style={{ color: 'var(--cre-color-text-muted)', marginBottom: 40, fontSize: 14 }}>
        Current mode: <strong>{mode}</strong> — toggle via the toolbar above.
      </p>

      {/* ── Colors ── */}
      <Section title="Color Palette">
        <PaletteRow name="primary"   colors={colors.primary} />
        <PaletteRow name="secondary" colors={colors.secondary} />
        <PaletteRow name="tertiary"  colors={colors.tertiary} />
        <PaletteRow name="neutral"   colors={colors.neutral} />
      </Section>

      <Section title="Feedback Colors">
        <PaletteRow name="success" colors={colors.feedback.success} />
        <PaletteRow name="alert"   colors={colors.feedback.alert} />
        <PaletteRow name="error"   colors={colors.feedback.error} />
      </Section>

      <Section title="Semantic Colors">
        {[
          { label: '--cre-color-bg',            varName: 'var(--cre-color-bg)' },
          { label: '--cre-color-surface',       varName: 'var(--cre-color-surface)' },
          { label: '--cre-color-surface-raised', varName: 'var(--cre-color-surface-raised)' },
          { label: '--cre-color-text',          varName: 'var(--cre-color-text)' },
          { label: '--cre-color-text-muted',    varName: 'var(--cre-color-text-muted)' },
          { label: '--cre-color-text-subtle',   varName: 'var(--cre-color-text-subtle)' },
          { label: '--cre-color-border',        varName: 'var(--cre-color-border)' },
          { label: '--cre-color-border-strong', varName: 'var(--cre-color-border-strong)' },
          { label: '--cre-color-focus',         varName: 'var(--cre-color-focus)' },
        ].map(({ label, varName }) => (
          <TokenRow
            key={label}
            label={label}
            value={varName}
            preview={
              <div style={{
                width: 28,
                height: 28,
                background: varName,
                borderRadius: 4,
                border: '1px solid var(--cre-color-border)',
                flexShrink: 0,
              }} />
            }
          />
        ))}
      </Section>

      <Section title="Semantic Accent / Action">
        {[
          { label: '--cre-accent-bg',            varName: 'var(--cre-accent-bg)' },
          { label: '--cre-accent-fg',            varName: 'var(--cre-accent-fg)' },
          { label: '--cre-accent-border',        varName: 'var(--cre-accent-border)' },
          { label: '--cre-accent-hover-bg',      varName: 'var(--cre-accent-hover-bg)' },
          { label: '--cre-accent-hover-border',  varName: 'var(--cre-accent-hover-border)' },
          { label: '--cre-accent-active-bg',     varName: 'var(--cre-accent-active-bg)' },
          { label: '--cre-accent-active-border', varName: 'var(--cre-accent-active-border)' },
          { label: '--cre-accent-disabled-bg',     varName: 'var(--cre-accent-disabled-bg)' },
          { label: '--cre-accent-disabled-fg',     varName: 'var(--cre-accent-disabled-fg)' },
          { label: '--cre-accent-disabled-border', varName: 'var(--cre-accent-disabled-border)' },
        ].map(({ label, varName }) => (
          <TokenRow
            key={label}
            label={label}
            value={varName}
            preview={
              <div style={{
                width: 28,
                height: 28,
                background: varName,
                borderRadius: 4,
                border: '1px solid var(--cre-color-border)',
                flexShrink: 0,
              }} />
            }
          />
        ))}
      </Section>

      {/* ── Spacing ── */}
      <Section title="Spacing & Padding">
        {Object.entries(coreTokens.space).map(([name, px]) => (
          <SpaceBar key={name} name={name} px={px} />
        ))}
      </Section>

      {/* ── Border radius ── */}
      <Section title="Border Radius">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(coreTokens.radius).map(([name, px]) => (
            <RadiusSwatch key={name} name={name} px={px} />
          ))}
        </div>
      </Section>

      {/* ── Border width ── */}
      <Section title="Border Width">
        {Object.entries(coreTokens.borderWidth).map(([name, px]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--cre-color-text-muted)', width: 100 }}>
              {name}
            </code>
            <div style={{
              width: 120,
              height: px,
              background: 'var(--cre-color-text)',
            }} />
            <span style={{ fontSize: 12, color: 'var(--cre-color-text-subtle)' }}>{px}px</span>
          </div>
        ))}
      </Section>

      {/* ── Typography ── */}
      <Section title="Font Families">
        {Object.entries(coreTokens.fontFamily).map(([name, value]) => (
          <div key={name} style={{ marginBottom: 12 }}>
            <TokenRow label={`--cre-font-family-${name}`} value={value} />
            <div style={{
              fontFamily: value,
              fontSize: 18,
              color: 'var(--cre-color-text)',
              paddingLeft: 40,
            }}>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
      </Section>

      {/* ── Opacity ── */}
      <Section title="Opacity">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(coreTokens.opacity).map(([name, value]) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 56,
                height: 56,
                background: colors.primary[600],
                opacity: value,
                borderRadius: 'var(--cre-radius-xsmall)',
                border: '1px solid var(--cre-color-border)',
              }} />
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--cre-color-text-muted)' }}>
                {name}
              </span>
              <span style={{ fontSize: 10, color: 'var(--cre-color-text-subtle)' }}>{value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Storybook meta ───────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Web/Tokens/Design Tokens',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Reference: StoryObj = {
  render: () => React.createElement(TokenReference),
  name: 'Token Reference',
};
