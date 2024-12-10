export default {
  '**/*.{js,json,sol,ts}': (filenames) =>
    `prettier --write ${filenames.join(' ')}`,
};
