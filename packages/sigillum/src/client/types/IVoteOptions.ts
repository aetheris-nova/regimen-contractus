import type { Address } from 'viem';

// enums
import { VoteChoiceEnum } from '@client/enums';

interface IVoteOptions {
  choice: VoteChoiceEnum;
  proposal: Address;
}

export default IVoteOptions;
