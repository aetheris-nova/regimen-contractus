import type { ILogger } from '_types';
import type { Provider } from 'ethers';

// types
import type { IArbiterContract } from '@client/types';
import type IBaseOptions from './IBaseOptions';

interface INewOptions extends IBaseOptions {
  address: string;
  contract: IArbiterContract;
  logger: ILogger;
  provider: Provider;
}

export default INewOptions;
