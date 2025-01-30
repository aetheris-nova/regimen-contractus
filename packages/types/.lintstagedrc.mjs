import { resolve } from 'node:path';

export default (() => {
  const packageDir = 'types';
  const packageName = 'regimen-contractus-types';

  return {
    '**/*.{js,json,ts}': (filenames) => [
      `sh -c 'pnpm -F @aetherisnova/${packageName} run generate:index && git add ${resolve(process.cwd(), 'packages', packageDir, 'src', 'index.ts')}'`,
      `prettier --write ${filenames.join(' ')}`,
    ],
  };
})();
