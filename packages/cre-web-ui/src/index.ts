// ── Components ────────────────────────────────────────────────────────────────
export { Button } from './components/Button';
export type { CreButtonProps, CreButtonSize } from './components/Button';

// ── Primitives ────────────────────────────────────────────────────────────────
export { Box } from './primitives/Box';
export type { BoxProps } from './primitives/Box';

export { Stack } from './primitives/Stack';
export type { StackProps } from './primitives/Stack';

export { Inline } from './primitives/Inline';
export type { InlineProps } from './primitives/Inline';

export { Cluster } from './primitives/Cluster';
export type { ClusterProps } from './primitives/Cluster';

export { Container } from './primitives/Container';
export type { ContainerProps, CreContainerSize } from './primitives/Container';

export { Grid } from './primitives/Grid';
export type { GridProps } from './primitives/Grid';

export { Surface } from './primitives/Surface';
export type { SurfaceProps, CreSurfaceVariant } from './primitives/Surface';

export { Divider } from './primitives/Divider';
export type { DividerProps } from './primitives/Divider';

export { Text } from './primitives/Text';
export type { TextProps, CreTextTone, CreTextVariant } from './primitives/Text';

export { Heading } from './primitives/Heading';
export type { HeadingProps } from './primitives/Heading';

export { IconSlot } from './primitives/IconSlot';
export type { IconSlotProps } from './primitives/IconSlot';

export { ScrollArea } from './primitives/ScrollArea';
export type { ScrollAreaProps } from './primitives/ScrollArea';

export type { CreSpace } from './primitives/spacing';
export type { CreRadius } from './primitives/radius';

// ── Theme provider & hook ─────────────────────────────────────────────────────
export { CreThemeProvider, useCreTheme } from './theme/CreThemeProvider';
export type { CreThemeProviderProps } from './theme/CreThemeProvider';

// ── Token factories & types ───────────────────────────────────────────────────
export { createThemeTokens, getBasePalette } from './theme/tokens';
export type { CreThemeMode, CreThemeTokens, CrePalette } from './theme/tokens';

// ── Raw tokens (source-of-truth values from the Figma JSON exports) ───────────
export { coreTokens, lightColorTokens, darkColorTokens } from './theme/rawTokens';
export type { CoreTokens, ColorTokens } from './theme/rawTokens';

// ── CSS variable generation ───────────────────────────────────────────────────
export { coreTokensToCssVars, themeTokensToCssVars } from './theme/cssVars';
export type { CreCssVars } from './theme/cssVars';
