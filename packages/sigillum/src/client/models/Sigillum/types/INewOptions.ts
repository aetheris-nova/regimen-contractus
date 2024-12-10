import type { ILogger } from '_types';

// types
import type { ISigillumContract } from '@client/types';
import type IBaseOptions from './IBaseOptions';

interface INewOptions extends IBaseOptions {
  address: string;
  contract: ISigillumContract;
  logger: ILogger;
}

export default INewOptions;
