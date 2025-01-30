import { resolve } from 'node:path';

export default (() => {
  const packageName = 'arbiter';

  return {
    '**/*.{js,json,sol,ts}': (filenames) => [
      `sh -c 'pnpm -F @aetherisnova/${packageName} run generate:index && git add ${resolve(process.cwd(), 'packages', packageName, 'src', 'client', 'index.ts')}'`,
      `prettier --write ${filenames.join(' ')}`,
    ],
  };
})();
