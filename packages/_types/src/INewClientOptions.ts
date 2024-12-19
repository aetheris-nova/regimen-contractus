import type { BaseContract, JsonRpcProvider } from 'ethers';

// types
import type IBaseClientOptions from './IBaseClientOptions';
import type ILogger from './ILogger';

interface INewClientOptions<Contract extends BaseContract> extends IBaseClientOptions {
  address: string;
  contract: Contract;
  logger: ILogger;
  provider: JsonRpcProvider;
}

export default INewClientOptions;
