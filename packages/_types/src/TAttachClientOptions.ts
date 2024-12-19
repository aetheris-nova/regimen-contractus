// types
import type IBaseClientOptions from './IBaseClientOptions';
import type IInitializeClientOptions from './IInitializeClientOptions';

/**
 * @property {string} address - The address of the contract.
 */
interface IAttachClientOptions {
  address: string;
}

type TAttachClientOptions = IBaseClientOptions & IInitializeClientOptions & IAttachClientOptions;

export default TAttachClientOptions;
