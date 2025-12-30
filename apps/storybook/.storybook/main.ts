import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/nextjs-vite';
import { storybookOnlookPlugin } from '@onlook/storybook-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Include stories from packages/ui (components directory only, excludes node_modules)
    '../../../packages/ui/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Include stories from packages/features
    '../../../packages/features/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // Include stories from apps/web/components
    '../../../apps/web/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    // Path aliases for apps/web components
    const webAppPath = resolve(__dirname, '../../../apps/web');

    // storybookOnlookPlugin handles:
    // - Component location injection (data-component-file, etc.)
    // - HMR configuration for E2B sandboxes
    // - CORS configuration
    // - Static build detection (returns [] for CI/Chromatic)
    return mergeConfig(config, {
      plugins: [storybookOnlookPlugin()],
      resolve: {
        alias: {
          '@components': join(webAppPath, 'components'),
          '@lib': join(webAppPath, 'lib'),
          '@server': join(webAppPath, 'server'),
          '@pages': join(webAppPath, 'pages'),
          '~': join(webAppPath, 'modules'),
        },
      },
    });
  },
};
export default config;
