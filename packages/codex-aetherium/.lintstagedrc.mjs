export default (() => {
  return {
    '**/*.{js,json,ts}': (filenames) => [
      `prettier --write ${filenames.join(' ')}`,
    ],
  };
})();
