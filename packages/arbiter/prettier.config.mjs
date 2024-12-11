import defaultConfig from '../../prettier.config.mjs';

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  ...defaultConfig,
  plugins: ['prettier-plugin-solidity'],
};

export default config;
