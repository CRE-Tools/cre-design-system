import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '@cre/web-ui';
import type { CreButtonSize } from '@cre/web-ui';

// ─── Inline SVG icons (no icon library dependency) ────────────────────────────

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconDownload = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3v9M5 8l4 4 4-4M3 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Shared label helper for comparison stories ───────────────────────────────

const Label = ({ children }: { children: string }) =>
  React.createElement('div', {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--cre-color-text-muted)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      marginTop: 20,
      marginBottom: 8,
    }
  }, children);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title: 'Web/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: { page: null }, // docs page is provided by Button.docs.mdx
  },
  argTypes: {
    children: {
      description: 'Button label content',
      control: 'text',
    },
    size: {
      description: 'Size variant',
      control: 'radio',
      options: ['regular', 'large', 'vr'] satisfies CreButtonSize[],
    },
    disabled: {
      description: 'Applies disabled token colors and blocks interaction',
      control: 'boolean',
    },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'CRE Button',
    size: 'regular',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Playground ───────────────────────────────────────────────────────────────

/**
 * Interactive playground — use the controls panel to change size, label,
 * and disabled state. Theme toggle in the toolbar switches light/dark mode.
 */
export const Playground: Story = {};

// ─── Icon variants ────────────────────────────────────────────────────────────

/** Button with a leading icon — use for create / add actions. */
export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: React.createElement(IconPlus),
    children: 'Create new',
  },
};

/** Button with a trailing icon — use for navigation / directional actions. */
export const WithTrailingIcon: Story = {
  args: {
    trailingIcon: React.createElement(IconArrowRight),
    children: 'Continue',
  },
};

/** Button with both icons — leading for context, trailing for direction. */
export const WithBothIcons: Story = {
  args: {
    leadingIcon: React.createElement(IconDownload),
    trailingIcon: React.createElement(IconArrowRight),
    children: 'Download file',
  },
};

// ─── States ───────────────────────────────────────────────────────────────────

/** Disabled state — applies disabled token colors, blocks all interaction. */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Not available',
  },
};

/** Disabled with icon — icon color inherits disabled fg token. */
export const DisabledWithIcon: Story = {
  args: {
    disabled: true,
    leadingIcon: React.createElement(IconPlus),
    children: 'Not available',
  },
};

// ─── Size comparison ──────────────────────────────────────────────────────────

/**
 * All three size variants side by side.
 * Regular is the default for web; Large for prominent actions; VR for spatial UI.
 */
export const SizeComparison: Story = {
  parameters: { layout: 'padded' },
  render: () =>
    React.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 } },

      React.createElement(Label, { children: 'Regular (default)' }),
      React.createElement(
        'div', { style: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const } },
        React.createElement(Button, { size: 'regular', children: 'Button label' }),
        React.createElement(Button, { size: 'regular', leadingIcon: React.createElement(IconPlus), children: 'Create new' }),
        React.createElement(Button, { size: 'regular', trailingIcon: React.createElement(IconArrowRight), children: 'Continue' }),
        React.createElement(Button, { size: 'regular', disabled: true, children: 'Disabled' }),
      ),

      React.createElement(Label, { children: 'Large' }),
      React.createElement(
        'div', { style: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const } },
        React.createElement(Button, { size: 'large', children: 'Button label' }),
        React.createElement(Button, { size: 'large', leadingIcon: React.createElement(IconPlus), children: 'Create new' }),
        React.createElement(Button, { size: 'large', trailingIcon: React.createElement(IconArrowRight), children: 'Continue' }),
        React.createElement(Button, { size: 'large', disabled: true, children: 'Disabled' }),
      ),

      React.createElement(Label, { children: 'VR (extra-large)' }),
      React.createElement(
        'div', { style: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const } },
        React.createElement(Button, { size: 'vr', children: 'Button label' }),
        React.createElement(Button, { size: 'vr', leadingIcon: React.createElement(IconPlus), children: 'Create new' }),
        React.createElement(Button, { size: 'vr', trailingIcon: React.createElement(IconArrowRight), children: 'Continue' }),
        React.createElement(Button, { size: 'vr', disabled: true, children: 'Disabled' }),
      ),
    ),
};

// ─── All states (for QA) ──────────────────────────────────────────────────────

/** All icon configurations for the default size — quick visual QA. */
export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () =>
    React.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' } },
      React.createElement(Button, { onClick: () => {}, children: 'Label only' }),
      React.createElement(Button, { leadingIcon: React.createElement(IconPlus), onClick: () => {}, children: 'Leading icon' }),
      React.createElement(Button, { trailingIcon: React.createElement(IconArrowRight), onClick: () => {}, children: 'Trailing icon' }),
      React.createElement(Button, { leadingIcon: React.createElement(IconDownload), trailingIcon: React.createElement(IconArrowRight), onClick: () => {}, children: 'Both icons' }),
      React.createElement(Button, { disabled: true, leadingIcon: React.createElement(IconPlus), children: 'Disabled' }),
    ),
};

// ─── Icon alignment (spatial QA) ─────────────────────────────────────────────

/**
 * Verifies icon slot dimensions, gap, and padding across all sizes.
 * Compare the three rows to confirm correct spacing at each scale.
 */
export const IconAlignment: Story = {
  parameters: { layout: 'padded' },
  render: () =>
    React.createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0 } },

      React.createElement(Label, { children: 'Regular' }),
      React.createElement(
        'div', { style: { display: 'flex', gap: 12, alignItems: 'center' } },
        React.createElement(Button, { size: 'regular', children: 'No icon' }),
        React.createElement(Button, { size: 'regular', leadingIcon: React.createElement(IconPlus), children: 'Leading' }),
        React.createElement(Button, { size: 'regular', trailingIcon: React.createElement(IconArrowRight), children: 'Trailing' }),
        React.createElement(Button, { size: 'regular', leadingIcon: React.createElement(IconDownload), trailingIcon: React.createElement(IconArrowRight), children: 'Both' }),
      ),

      React.createElement(Label, { children: 'Large' }),
      React.createElement(
        'div', { style: { display: 'flex', gap: 12, alignItems: 'center' } },
        React.createElement(Button, { size: 'large', children: 'No icon' }),
        React.createElement(Button, { size: 'large', leadingIcon: React.createElement(IconPlus), children: 'Leading' }),
        React.createElement(Button, { size: 'large', trailingIcon: React.createElement(IconArrowRight), children: 'Trailing' }),
        React.createElement(Button, { size: 'large', leadingIcon: React.createElement(IconDownload), trailingIcon: React.createElement(IconArrowRight), children: 'Both' }),
      ),

      React.createElement(Label, { children: 'VR' }),
      React.createElement(
        'div', { style: { display: 'flex', gap: 12, alignItems: 'center' } },
        React.createElement(Button, { size: 'vr', children: 'No icon' }),
        React.createElement(Button, { size: 'vr', leadingIcon: React.createElement(IconPlus), children: 'Leading' }),
        React.createElement(Button, { size: 'vr', trailingIcon: React.createElement(IconArrowRight), children: 'Trailing' }),
        React.createElement(Button, { size: 'vr', leadingIcon: React.createElement(IconDownload), trailingIcon: React.createElement(IconArrowRight), children: 'Both' }),
      ),
    ),
};
