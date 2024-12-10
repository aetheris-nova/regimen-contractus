import eslint from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import typescriptConfig from 'typescript-eslint';

/**
 * @type {import('eslint').Linter.Config[]}
 **/
export default [
  eslint.configs.recommended,
  ...typescriptConfig.configs.recommended,
  prettierConfig,
  // custom config
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    rules: {
      'prefer-const': 'off',
    },
  },
];
