import type { ILogger } from '@aetherisnova/types';
import type { Config as WagmiConfig } from '@wagmi/core';

interface IInitializeClientOptions {
  logger?: ILogger;
  wagmiConfig: WagmiConfig;
}

export default IInitializeClientOptions;
