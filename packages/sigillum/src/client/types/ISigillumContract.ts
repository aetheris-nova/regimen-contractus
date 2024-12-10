import type { BaseContract, ContractTransactionResponse } from 'ethers';

interface ISigillumContract extends BaseContract {
  readonly burn: (id: bigint) => Promise<ContractTransactionResponse>;
  readonly contractURI: () => Promise<string>;
  readonly mint: (recipient: string) => Promise<ContractTransactionResponse>;
  readonly supply: () => Promise<bigint>;
  readonly tokenURI: (id: bigint) => Promise<string>;
}

export default ISigillumContract;
