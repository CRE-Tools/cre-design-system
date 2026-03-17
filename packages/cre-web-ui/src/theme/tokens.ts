export type CreThemeMode = 'light' | 'dark';

export type CrePalette = {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  neutral: {
    0: string;
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    1000: string;
  };
};

export type CreThemeTokens = {
  mode: CreThemeMode;
  palette: CrePalette;
  semantic: {
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
  };
  components: {
    button: {
      bg: string;
      fg: string;
      border: string;
      hoverBg: string;
      hoverFg: string;
      hoverBorder: string;
      activeBg: string;
      activeFg: string;
      activeBorder: string;
      disabledBg: string;
      disabledFg: string;
      disabledBorder: string;
    };
  };
};

function getNeutralPalette(): CrePalette['neutral'] {
  return {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    1000: '#0A0A0A'
  };
}

function getLightPrimaryPalette(): CrePalette['primary'] {
  return {
    50: '#FCE7EF',
    100: '#F7C1D2',
    200: '#F19AB5',
    300: '#EA7398',
    400: '#E44C7B',
    500: '#8A0538',
    600: '#760430',
    700: '#620328',
    800: '#4E0220',
    900: '#3A0118'
  };
}

function getDarkPrimaryPalette(): CrePalette['primary'] {
  return {
    50: '#EFE8FB',
    100: '#D6C6F6',
    200: '#BEA5F1',
    300: '#A684EC',
    400: '#8E63E7',
    500: '#591DB9',
    600: '#4C189E',
    700: '#3F1483',
    800: '#320F68',
    900: '#250B4D'
  };
}

export function getBasePalette(mode: CreThemeMode = 'light'): CrePalette {
  return {
    primary: mode === 'dark' ? getDarkPrimaryPalette() : getLightPrimaryPalette(),
    neutral: getNeutralPalette()
  };
}

export function createThemeTokens(mode: CreThemeMode): CreThemeTokens {
  const palette = getBasePalette(mode);

  const semantic =
    mode === 'dark'
      ? {
          background: palette.neutral[1000],
          surface: palette.neutral[900],
          text: palette.neutral[0],
          textMuted: palette.neutral[300],
          border: palette.neutral[700]
        }
      : {
          background: palette.neutral[0],
          surface: palette.neutral[50],
          text: palette.neutral[900],
          textMuted: palette.neutral[600],
          border: palette.neutral[200]
        };

  const button =
    mode === 'dark'
      ? {
          bg: palette.primary[500],
          fg: palette.neutral[0],
          border: palette.primary[700],
          hoverBg: palette.primary[600],
          hoverFg: palette.neutral[0],
          hoverBorder: palette.primary[800],
          activeBg: palette.primary[700],
          activeFg: palette.neutral[0],
          activeBorder: palette.primary[900],
          disabledBg: palette.neutral[800],
          disabledFg: palette.neutral[400],
          disabledBorder: palette.neutral[700]
        }
      : {
          bg: palette.primary[500],
          fg: palette.neutral[0],
          border: palette.primary[700],
          hoverBg: palette.primary[600],
          hoverFg: palette.neutral[0],
          hoverBorder: palette.primary[800],
          activeBg: palette.primary[700],
          activeFg: palette.neutral[0],
          activeBorder: palette.primary[900],
          disabledBg: palette.neutral[200],
          disabledFg: palette.neutral[600],
          disabledBorder: palette.neutral[300]
        };

  return {
    mode,
    palette,
    semantic,
    components: {
      button
    }
  };
}
