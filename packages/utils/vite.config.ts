import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist',
  },
  plugins: [
    dts({
      tsconfigPath: 'tsconfig.build.json',
    }),
    tsconfigPaths(),
  ],
});
