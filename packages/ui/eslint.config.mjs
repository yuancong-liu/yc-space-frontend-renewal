import { createConfig } from '@yc/eslint-config';

export default createConfig({
  componentGlobs: ['src/components/**/*.{ts,tsx}'],
  withNext: false,
});
