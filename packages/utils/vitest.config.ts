import { defineConfig, mergeConfig } from 'vitest/config';

// configs
import commonConfig from './vite.common.config';

export default mergeConfig(
  commonConfig,
  defineConfig({
    test: {
      dir: 'src',
      passWithNoTests: true,
      setupFiles: ['vitest.setup.ts'],
      testTimeout: 60000,
    },
  })
);
