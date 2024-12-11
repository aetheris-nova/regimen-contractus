import type { JsonRpcProvider } from 'ethers';

// types
import type IBaseOptions from './IBaseOptions';

/**
 * @property {string} address - The address of the contract.
 * @property {JsonRpcProvider} provider - An ethers.js `Provider`.
 */
interface IInitOptions extends IBaseOptions {
  address: string;
  provider: JsonRpcProvider;
  signerAddress?: string;
}

export default IInitOptions;
