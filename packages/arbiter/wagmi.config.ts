import { defineConfig } from '@wagmi/cli';
import { foundry } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/client/abis/index.ts',
  plugins: [
    foundry({
      artifacts: 'dist/contracts',
      include: ['Arbiter*.json', 'Proposal*.json'],
    }),
  ],
});
