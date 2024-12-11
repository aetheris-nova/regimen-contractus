import { defineConfig, mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';

// configs
import commonConfig from './vite.common.config';

export default mergeConfig(
  commonConfig,
  defineConfig({
    build: {
      lib: {
        entry: 'src/client/index.ts',
        formats: ['es'],
        fileName: 'index',
      },
      outDir: 'dist/client',
    },
    plugins: [
      dts({
        tsconfigPath: 'tsconfig.build.json',
      }),
    ],
  })
);
