import type { ILogger } from '_types';

// types
import type { IRegimenContract } from '@client/types';
import type IBaseOptions from './IBaseOptions';

interface INewOptions extends IBaseOptions {
  address: string;
  contract: IRegimenContract;
  logger: ILogger;
}

export default INewOptions;
