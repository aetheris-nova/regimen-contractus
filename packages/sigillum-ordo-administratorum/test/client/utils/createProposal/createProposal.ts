import { Arbiter, Proposal } from '@aetherisnova/arbiter';

// types
import type { IOptions } from './types';

/**
 * Convenience function to submit a proposal.
 * @param {IOptions} options - The contract address, provider and proposal details.
 * @returns {Promise<Proposal>} A promise that resolves to the initialized proposal contract.
 */
export default async function createProposal({
  contractAddress,
  duration,
  proposer,
  start,
  title,
  wagmiConfig,
}: IOptions): Promise<Proposal> {
  const silent = true;
  const arbiterContract = await Arbiter.attach({
    address: contractAddress,
    silent,
    wagmiConfig,
  });
  const { result } = await arbiterContract.propose({
    duration,
    proposer,
    start,
    title,
  });

  return await Proposal.attach({
    address: result,
    silent,
    wagmiConfig,
  });
}
