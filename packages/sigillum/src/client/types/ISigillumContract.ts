import type { BaseContract, ContractTransactionResponse } from 'ethers';

interface ISigillumContract extends BaseContract {
  readonly arbiter: () => Promise<string>;
  readonly burn: (id: bigint) => Promise<ContractTransactionResponse>;
  readonly contractURI: () => Promise<string>;
  readonly description: () => Promise<string>;
  readonly mint: (recipient: string) => Promise<ContractTransactionResponse>;
  readonly name: () => Promise<string>;
  readonly propose: (title: string, start: bigint, duration: bigint) => Promise<ContractTransactionResponse>;
  readonly setArbiter: (arbiter: string) => Promise<ContractTransactionResponse>;
  readonly supply: () => Promise<bigint>;
  readonly symbol: () => Promise<string>;
  readonly tokenURI: (id: bigint) => Promise<string>;
  readonly version: () => Promise<string>;
}

export default ISigillumContract;
