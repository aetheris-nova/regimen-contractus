import type { JsonRpcProvider } from 'ethers';

// types
import type IBaseOptions from './IBaseOptions';

interface IDeployOptions extends IBaseOptions {
  description: string;
  name: string;
  provider: JsonRpcProvider;
  signerAddress?: string;
  symbol: string;
}

export default IDeployOptions;
