import type { JsonRpcProvider } from 'ethers';

// types
import type IBaseOptions from './IBaseOptions';

interface IDeployOptions extends IBaseOptions {
  provider: JsonRpcProvider;
  signerAddress?: string;
}

export default IDeployOptions;
