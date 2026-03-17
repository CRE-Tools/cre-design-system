import type { Preview } from '@storybook/react';
import React from 'react';
import { CreThemeProvider } from '@cre/web-ui';

const preview: Preview = {
  globalTypes: {
    themeMode: {
      description: 'Theme mode for CRE UI',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ]
      }
    }
  },
  decorators: [
    (Story, context) => {
      const mode = context.globals.themeMode === 'dark' ? 'dark' : 'light';
      return React.createElement(
        CreThemeProvider,
        { mode, scope: 'global', key: mode },
        React.createElement(
          'div',
          {
            style: {
              padding: 16,
              background: 'transparent',
              color: 'var(--cre-color-text)'
            }
          },
          React.createElement(Story)
        )
      );
    }
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
