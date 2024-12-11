export default {
  '**/*.ts': (filenames) => [
    `sh -c 'pnpm -F _utils run generate:index && git add ./src/index.ts'`,
    `prettier --write ${filenames.join(' ')}`,
  ],
};
