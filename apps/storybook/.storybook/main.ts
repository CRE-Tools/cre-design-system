import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/{web,unity}/**/*.mdx', '../src/stories/{web,unity}/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(viteConfig) {
    const existing = viteConfig.plugins ?? [];
    return {
      ...viteConfig,
      esbuild: {
        ...((viteConfig as any).esbuild ?? {}),
        keepNames: true,
      },
      plugins: [
        ...existing,
        {
          name: 'cre-unity-brotli-headers',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              const url = req.url ?? '';
              if (!url.endsWith('.br')) return next();

              res.setHeader('Content-Encoding', 'br');

              const withoutQuery = url.split('?')[0] ?? url;
              const base = withoutQuery.replace(/\.br$/, '');

              if (base.endsWith('.wasm')) res.setHeader('Content-Type', 'application/wasm');
              else if (base.endsWith('.js')) res.setHeader('Content-Type', 'text/javascript');
              else if (base.endsWith('.data')) res.setHeader('Content-Type', 'application/octet-stream');
              else if (base.endsWith('.json')) res.setHeader('Content-Type', 'application/json');

              return next();
            });
          }
        }
      ]
    };
  }
};

export default config;
