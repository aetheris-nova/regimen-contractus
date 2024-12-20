export default {
  '**/*.ts': (filenames) => [
    `sh -c 'pnpm -F @aetherisnova/regimen-contractus-utils run generate:index && git add ./src/index.ts'`,
    `prettier --write ${filenames.join(' ')}`,
  ],
};
