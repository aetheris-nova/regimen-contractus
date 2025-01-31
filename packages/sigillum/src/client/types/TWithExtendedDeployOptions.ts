import type { Abi, Hex } from 'viem';

// types
import { Sigillum } from '@client/models';

interface IWithExtendedDeployOptions {
  abi: Abi;
  bytecode: Hex;
  Class: typeof Sigillum;
}
type TWithExtendedDeployOptions<Type> = IWithExtendedDeployOptions & Type;

export default TWithExtendedDeployOptions;
