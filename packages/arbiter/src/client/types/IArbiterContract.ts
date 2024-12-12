import type { BaseContract, ContractTransactionResponse } from 'ethers';

interface IArbiterContract extends BaseContract {
  readonly addToken: (token: string) => Promise<ContractTransactionResponse>;
  readonly eligibility: (token: string) => Promise<boolean>;
  readonly proposalURI: (id: Uint8Array) => Promise<string>;
  readonly removeToken: (token: string) => Promise<ContractTransactionResponse>;
}

export default IArbiterContract;
