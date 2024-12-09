import type { ILogger } from '@aetherisnova/types';
import { createLogger } from '@aetherisnova/utils';
import { Wallet } from 'ethers';

// artifacts
// @ts-ignore
import artifact from '../contracts/Sigillum/Sigillum.abi.json';
/* eslint-enable @typescript-eslint/ban-ts-comment */

// types
import type { IDeployOptions, INewOptions } from './types';

export default class Sigillum {
  protected _contractAddress: string;
  protected readonly _logger: ILogger;

  private constructor({ contractAddress }: INewOptions) {
    this._contractAddress = contractAddress;
    this._logger = createLogger();
  }

  /**
   * public static methods
   */

  public static deploy({ privateKey, provider }: IDeployOptions) {
    const signer = new Wallet(privateKey, provider);
  }
}
