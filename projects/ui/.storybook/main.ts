import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts)', '../docs/**/*.mdx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/angular',
  staticDirs: [{ from: '../src/styles', to: 'styles' }],
  docs: {
    defaultName: 'Docs',
  },
};

export default config;
