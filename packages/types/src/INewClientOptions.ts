import type { ILogger } from '@aetherisnova/types';
import type { Config as WagmiConfig } from '@wagmi/core';
import type { Address } from 'viem';

// types
import type IBaseClientOptions from './IBaseClientOptions';

interface INewClientOptions extends IBaseClientOptions {
  address: Address;
  logger: ILogger;
  wagmiConfig: WagmiConfig;
}

export default INewClientOptions;
