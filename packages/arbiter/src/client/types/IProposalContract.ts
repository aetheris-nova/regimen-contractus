import type { BaseContract } from 'ethers';

interface IProposalContract extends BaseContract {
  readonly details: () => Promise<
    [
      boolean, // canceled
      bigint, // duration
      boolean, // executed
      string, // proposer
      bigint, // start
      string, // title
    ]
  >;
  readonly version: () => Promise<string>;
  readonly voteResults: () => Promise<
    [
      bigint, // accept
      bigint, // abstain
      bigint, // reject
    ]
  >;
}

export default IProposalContract;
