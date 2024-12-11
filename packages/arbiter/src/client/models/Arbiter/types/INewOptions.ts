import type { ILogger } from '_types';

// types
import type { IArbiterContract } from '@client/types';
import type IBaseOptions from './IBaseOptions';

interface INewOptions extends IBaseOptions {
  address: string;
  contract: IArbiterContract;
  logger: ILogger;
}

export default INewOptions;
