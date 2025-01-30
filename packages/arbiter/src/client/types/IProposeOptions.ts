import type { Address } from 'viem';

interface IProposeOptions {
  duration: bigint;
  proposer: Address;
  start: bigint;
  title: string;
}

export default IProposeOptions;
