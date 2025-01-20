import { resolve } from 'node:path';

export default (() => {
  const packageName = 'regimen-contractus-utils';

  return {
    '**/*.{js,json,ts}': (filenames) => [
      `sh -c 'pnpm -F @aetherisnova/${packageName} run generate:index && git add ${resolve(process.cwd(), 'packages', packageName, 'src', 'index.ts')}'`,
      `prettier --write ${filenames.join(' ')}`,
    ],
  };
})();
