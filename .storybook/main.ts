import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/postcss';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.{ts,tsx}'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async config =>
    mergeConfig(config, {
      resolve: {
        alias: { '@': new URL('../src', import.meta.url).pathname },
      },
      // postcss.config.mjs lists the plugin by name because Next bundles that
      // file; Vite needs the instantiated plugin instead, so pass it inline.
      css: {
        postcss: { plugins: [tailwindcss()] },
      },
    }),
};

export default config;
