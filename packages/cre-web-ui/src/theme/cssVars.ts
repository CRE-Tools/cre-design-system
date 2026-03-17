import type { CreThemeTokens } from './tokens';

export type CreCssVars = Record<string, string>;

export function themeTokensToCssVars(tokens: CreThemeTokens): CreCssVars {
  return {
    '--cre-mode': tokens.mode,

    '--cre-color-bg': tokens.semantic.background,
    '--cre-color-surface': tokens.semantic.surface,
    '--cre-color-text': tokens.semantic.text,
    '--cre-color-text-muted': tokens.semantic.textMuted,
    '--cre-color-border': tokens.semantic.border,

    '--cre-button-bg': tokens.components.button.bg,
    '--cre-button-fg': tokens.components.button.fg,
    '--cre-button-border': tokens.components.button.border,

    '--cre-button-hover-bg': tokens.components.button.hoverBg,
    '--cre-button-hover-fg': tokens.components.button.hoverFg,
    '--cre-button-hover-border': tokens.components.button.hoverBorder,

    '--cre-button-active-bg': tokens.components.button.activeBg,
    '--cre-button-active-fg': tokens.components.button.activeFg,
    '--cre-button-active-border': tokens.components.button.activeBorder,

    '--cre-button-disabled-bg': tokens.components.button.disabledBg,
    '--cre-button-disabled-fg': tokens.components.button.disabledFg,
    '--cre-button-disabled-border': tokens.components.button.disabledBorder
  };
}
