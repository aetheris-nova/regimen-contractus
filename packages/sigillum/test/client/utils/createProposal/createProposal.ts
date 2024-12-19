import { Proposal } from '@aetherisnova/arbiter';

// models
import Sigillum from '@client/models/Sigillum';

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
  provider,
  signerAddress,
  start,
  title,
}: IOptions): Promise<Proposal> {
  const silent = true;
  const tokenContract = await Sigillum.attach({
    address: contractAddress,
    provider,
    signerAddress,
    silent,
  });
  const { result } = await tokenContract.propose({
    duration,
    start,
    title,
  });

  return await Proposal.attach({
    address: result,
    provider,
    signerAddress,
    silent,
  });
}
