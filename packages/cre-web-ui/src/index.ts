// ── Components ────────────────────────────────────────────────────────────────
export { Button } from './components/Button';
export type { CreButtonProps, CreButtonSize } from './components/Button';

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
