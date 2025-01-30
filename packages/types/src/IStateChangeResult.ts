import type { WaitForTransactionReceiptReturnType } from '@wagmi/core';

interface IStateChangeResult<Result> {
  result: Result;
  transaction: WaitForTransactionReceiptReturnType;
}

export default IStateChangeResult;
