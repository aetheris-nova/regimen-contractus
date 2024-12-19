import type { TDeployClientOptions } from '_types';

interface IDeployOptions extends TDeployClientOptions {
  arbiter: string;
  description: string;
  name: string;
  symbol: string;
}

export default IDeployOptions;
