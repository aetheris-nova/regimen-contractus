import type { ILogger } from '_types';
import type { BaseContract } from 'ethers';

// types
import type IBaseOptions from './IBaseOptions';

interface INewOptions extends IBaseOptions {
  address: string;
  contract: BaseContract;
  logger: ILogger;
}

export default INewOptions;
