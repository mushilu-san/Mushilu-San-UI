// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
  { ignores: ['**/generated/**'] },
  ...rootConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'docs', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'docs', style: 'camelCase' },
      ],
    },
  },
]);
