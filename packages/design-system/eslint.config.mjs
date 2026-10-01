import { globalIgnores } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';
import baseConfig from '@konkuk-icteam-fe/eslint-config';

export default [
  ...baseConfig,
  ...storybook.configs['flat/recommended'],
  globalIgnores(['storybook-static/**', 'dist/**']),
];
