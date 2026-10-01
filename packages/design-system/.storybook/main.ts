import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { mergeConfig } from 'vite';

/**
 * 패키지의 절대 경로를 찾는다. Yarn PnP나 모노레포처럼 addon이
 * 다른 위치에 hoist되는 환경에서 framework/addon 로딩에 필요하다.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-vitest'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  viteFinal: async (config) => mergeConfig(config, { plugins: [tailwindcss()] }),
};

export default config;
