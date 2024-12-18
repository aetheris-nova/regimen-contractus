// enums
import { VoteChoiceEnum } from '@client/enums';

interface IVoteResult {
  choice: VoteChoiceEnum;
  proposal: string;
  voted: boolean;
}

export default IVoteResult;
