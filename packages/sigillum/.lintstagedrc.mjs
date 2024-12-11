export default {
  '**/*.{js,json,sol,ts}': (filenames) => [
    `sh -c 'pnpm -F @aetherisnova/sigillum run generate:index && git add ./src/client/index.ts'`,
    `prettier --write ${filenames.join(' ')}`,
  ],
};
