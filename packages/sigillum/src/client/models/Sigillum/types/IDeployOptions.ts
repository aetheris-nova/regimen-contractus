import type { JsonRpcProvider } from 'ethers';

interface IDeployOptions {
  description: string;
  name: string;
  privateKey: string;
  provider: JsonRpcProvider;
  symbol: string;
}

export default IDeployOptions;
