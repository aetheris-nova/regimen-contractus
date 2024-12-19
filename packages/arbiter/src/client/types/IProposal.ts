interface IProposal {
  canceled: boolean;
  duration: bigint;
  executed: boolean;
  id: string;
  proposer: string;
  start: bigint;
  title: string;
}

export default IProposal;
