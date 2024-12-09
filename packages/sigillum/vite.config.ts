import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
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
    tsconfigPaths(),
  ],
});
