import type { JsonRpcProvider } from 'ethers';

interface IOptions {
  contractAddress: string;
  duration: bigint;
  provider: JsonRpcProvider;
  signerAddress?: string;
  start: bigint;
  title: string;
}

export default IOptions;
