import type { TDeployClientOptions } from '@aetherisnova/regimen-contractus-types';
import type { Address } from 'viem';

interface IDeployOptions extends TDeployClientOptions {
  arbiter: Address;
  description: string;
  name: string;
  symbol: string;
}

export default IDeployOptions;
