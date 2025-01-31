import type { Config as WagmiConfig } from '@wagmi/core';
import type { Address } from 'viem';

interface IOptions {
  contractAddress: Address;
  duration: bigint;
  proposer: Address;
  start: bigint;
  title: string;
  wagmiConfig: WagmiConfig;
}

export default IOptions;
