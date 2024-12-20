import type { TDeployClientOptions } from '@aetherisnova/regimen-contractus-types';

interface IDeployOptions extends TDeployClientOptions {
  arbiter: string;
  description: string;
  name: string;
  symbol: string;
}

export default IDeployOptions;
