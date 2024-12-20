import type { ContractTransactionReceipt } from 'ethers';

interface IStateChangeResult<Result> {
  result: Result;
  transaction: ContractTransactionReceipt;
}

export default IStateChangeResult;
