// enums
import { VoteChoiceEnum } from '@client/enums';

interface IVoteOptions {
  choice: VoteChoiceEnum;
  proposal: string;
  tokenID: bigint;
}

export default IVoteOptions;
