import type { IAccessControlContract } from '_types';
import type { ContractTransactionResponse } from 'ethers';

interface IArbiterContract extends IAccessControlContract {
  readonly addToken: (token: string) => Promise<ContractTransactionResponse>;
  readonly cancel: (proposal: string) => Promise<ContractTransactionResponse>;
  readonly eligibility: (token: string) => Promise<boolean>;
  readonly execute: (proposal: string) => Promise<ContractTransactionResponse>;
  readonly removeToken: (token: string) => Promise<ContractTransactionResponse>;
  readonly version: () => Promise<string>;
}

export default IArbiterContract;
