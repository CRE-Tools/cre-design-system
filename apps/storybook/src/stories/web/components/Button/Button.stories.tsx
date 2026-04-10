import type { Meta, StoryObj } from '@storybook/react';
import { Button, Inline, Stack, Text } from '@cre/web-ui';
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

const SectionLabel = ({ children }: { children: string }) => (
  <Text as="p" variant="caption" tone="muted">
    {children}
  </Text>
);

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
    leadingIcon: <IconPlus />,
    children: 'Create new',
  },
};

/** Button with a trailing icon — use for navigation / directional actions. */
export const WithTrailingIcon: Story = {
  args: {
    trailingIcon: <IconArrowRight />,
    children: 'Continue',
  },
};

/** Button with both icons — leading for context, trailing for direction. */
export const WithBothIcons: Story = {
  args: {
    leadingIcon: <IconDownload />,
    trailingIcon: <IconArrowRight />,
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
    leadingIcon: <IconPlus />,
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
  render: () => (
    <Stack gap="micro" align="flex-start">
      <SectionLabel>Regular (default)</SectionLabel>
      <Inline gap="nano" align="center" wrap>
        <Button size="regular">Button label</Button>
        <Button size="regular" leadingIcon={<IconPlus />}>
          Create new
        </Button>
        <Button size="regular" trailingIcon={<IconArrowRight />}>
          Continue
        </Button>
        <Button size="regular" disabled>
          Disabled
        </Button>
      </Inline>

      <SectionLabel>Large</SectionLabel>
      <Inline gap="nano" align="center" wrap>
        <Button size="large">Button label</Button>
        <Button size="large" leadingIcon={<IconPlus />}>
          Create new
        </Button>
        <Button size="large" trailingIcon={<IconArrowRight />}>
          Continue
        </Button>
        <Button size="large" disabled>
          Disabled
        </Button>
      </Inline>

      <SectionLabel>VR (extra-large)</SectionLabel>
      <Inline gap="nano" align="center" wrap>
        <Button size="vr">Button label</Button>
        <Button size="vr" leadingIcon={<IconPlus />}>
          Create new
        </Button>
        <Button size="vr" trailingIcon={<IconArrowRight />}>
          Continue
        </Button>
        <Button size="vr" disabled>
          Disabled
        </Button>
      </Inline>
    </Stack>
  ),
};

// ─── All states (for QA) ──────────────────────────────────────────────────────

/** All icon configurations for the default size — quick visual QA. */
export const AllStates: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack gap="nano" align="flex-start">
      <Button onClick={() => {}}>Label only</Button>
      <Button leadingIcon={<IconPlus />} onClick={() => {}}>
        Leading icon
      </Button>
      <Button trailingIcon={<IconArrowRight />} onClick={() => {}}>
        Trailing icon
      </Button>
      <Button leadingIcon={<IconDownload />} trailingIcon={<IconArrowRight />} onClick={() => {}}>
        Both icons
      </Button>
      <Button disabled leadingIcon={<IconPlus />}>
        Disabled
      </Button>
    </Stack>
  ),
};

// ─── Icon alignment (spatial QA) ─────────────────────────────────────────────

/**
 * Verifies icon slot dimensions, gap, and padding across all sizes.
 * Compare the three rows to confirm correct spacing at each scale.
 */
export const IconAlignment: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack gap="micro" align="flex-start">
      <SectionLabel>Regular</SectionLabel>
      <Inline gap="nano" align="center" wrap>
        <Button size="regular">No icon</Button>
        <Button size="regular" leadingIcon={<IconPlus />}>
          Leading
        </Button>
        <Button size="regular" trailingIcon={<IconArrowRight />}>
          Trailing
        </Button>
        <Button size="regular" leadingIcon={<IconDownload />} trailingIcon={<IconArrowRight />}>
          Both
        </Button>
      </Inline>

      <SectionLabel>Large</SectionLabel>
      <Inline gap="nano" align="center" wrap>
        <Button size="large">No icon</Button>
        <Button size="large" leadingIcon={<IconPlus />}>
          Leading
        </Button>
        <Button size="large" trailingIcon={<IconArrowRight />}>
          Trailing
        </Button>
        <Button size="large" leadingIcon={<IconDownload />} trailingIcon={<IconArrowRight />}>
          Both
        </Button>
      </Inline>

      <SectionLabel>VR</SectionLabel>
      <Inline gap="nano" align="center" wrap>
        <Button size="vr">No icon</Button>
        <Button size="vr" leadingIcon={<IconPlus />}>
          Leading
        </Button>
        <Button size="vr" trailingIcon={<IconArrowRight />}>
          Trailing
        </Button>
        <Button size="vr" leadingIcon={<IconDownload />} trailingIcon={<IconArrowRight />}>
          Both
        </Button>
      </Inline>
    </Stack>
  ),
};
