import type { BaseContract, ContractTransactionResponse } from 'ethers';

interface IRegimenContract extends BaseContract {
  readonly addToken: (token: string) => Promise<ContractTransactionResponse>;
  readonly canVote: (token: string) => Promise<boolean>;
  readonly removeToken: (token: string) => Promise<ContractTransactionResponse>;
}

export default IRegimenContract;
