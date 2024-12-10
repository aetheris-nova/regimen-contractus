export default {
  '**/*.ts': (filenames) => [
    `sh -c 'pnpm -F _types run generate:index && git add ./src/index.ts'`,
    `prettier --write ${filenames.join(' ')}`,
  ],
};
