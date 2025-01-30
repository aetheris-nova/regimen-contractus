import type { IWorldABIConfig } from '@aetherisnova/types';
import type { Address } from 'viem';

interface IWorldABIConfigResponse {
  base_dapp_url: string;
  cfg: IWorldABIConfig[];
  eip712: Record<'name' | 'version', string> | null;
  system_ids: Record<string, Address>;
  vault_dapp_url: string;
}

export default IWorldABIConfigResponse;
