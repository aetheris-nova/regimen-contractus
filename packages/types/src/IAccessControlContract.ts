import type { BaseContract, ContractTransactionResponse } from 'ethers';

interface IAccessControlContract extends BaseContract {
  readonly hasRole: (role: string, account: string) => Promise<boolean>;
  readonly grantRole: (role: string, account: string) => Promise<ContractTransactionResponse>;
  readonly revokeRole: (role: string, account: string) => Promise<ContractTransactionResponse>;
}

export default IAccessControlContract;
