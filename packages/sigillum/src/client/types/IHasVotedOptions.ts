import type { Address } from 'viem';

interface IHasVotedOptions {
  proposal: Address;
  tokenID: bigint;
}

export default IHasVotedOptions;
