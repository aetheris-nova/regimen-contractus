import type { JsonRpcProvider } from 'ethers';

interface IInitializeClientOptions {
  provider: JsonRpcProvider;
  signerAddress?: string;
}

export default IInitializeClientOptions;
