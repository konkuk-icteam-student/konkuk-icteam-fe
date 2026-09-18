import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  prettier,
];
