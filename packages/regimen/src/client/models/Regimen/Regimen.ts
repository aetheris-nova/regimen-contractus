import type { ILogger, IStateChangeResult } from '_types';
import { createLogger } from '_utils';
import {
  BaseContract,
  ContractFactory,
  ContractTransactionReceipt,
  type ContractTransactionResponse,
  Signer,
  makeError,
} from 'ethers';

// artifacts
import artifact from '@dist/contracts/Regimen.sol/Regimen.json';

// types
import type { IRegimenContract } from '@client/types';
import type { IDeployOptions, IInitOptions, INewOptions } from './types';

export default class Regimen {
  protected _contract: IRegimenContract;
  protected _debug: boolean;
  protected _address: string;
  protected readonly _logger: ILogger;

  private constructor({ address, contract, debug = false, logger }: INewOptions) {
    this._address = address;
    this._contract = contract;
    this._debug = debug;
    this._logger = logger;
  }

  /**
   * public static methods
   */

  public static async deploy({
    debug = false,
    provider,
    silent = false,
    signerAddress,
  }: IDeployOptions): Promise<Regimen> {
    const _functionName = 'deploy';
    const logger = createLogger(debug ? 'debug' : silent ? 'silent' : 'error');
    let contract: IRegimenContract;
    let contractFactory: ContractFactory;
    let creatorAddress: string;
    let deployTransaction: ContractTransactionResponse | null;
    let signer: Signer;

    try {
      signer = await provider.getSigner(signerAddress);
      creatorAddress = await signer.getAddress();
      contractFactory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
      contract = (await contractFactory.deploy()) as IRegimenContract;

      await contract.waitForDeployment();

      deployTransaction = contract.deploymentTransaction();

      debug &&
        logger.debug(
          `${Regimen.name}#${_functionName}: deployed contract using "${creatorAddress}" with transaction hash "${deployTransaction?.hash ?? '-'}" on chain "${deployTransaction?.chainId ?? '-'}"`
        );

      return new Regimen({
        address: await contract.getAddress(),
        contract,
        debug,
        logger,
      });
    } catch (error) {
      logger.error(`${Regimen.name}#${_functionName}: failed to deploy contract`, error);

      throw error;
    }
  }

  public static async init({
    debug = false,
    address,
    provider,
    signerAddress,
    silent = false,
  }: IInitOptions): Promise<Regimen> {
    return new Regimen({
      address,
      contract: new BaseContract(address, artifact.abi, await provider.getSigner(signerAddress)) as IRegimenContract,
      debug,
      logger: createLogger(debug ? 'debug' : silent ? 'silent' : 'error'),
    });
  }

  /**
   * public methods
   */

  /**
   * Gets the contract's address.
   * @returns {string} The contract address.
   * @public
   */
  public address(): string {
    return this._address;
  }

  /**
   * Sanctions a token to allow an account in possession of the token to vote.
   * @param {string} token - The address of the token contract.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async addToken(token: string): Promise<IStateChangeResult<null>> {
    const _functionName = 'addToken';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.addToken(token);
      receipt = await response.wait();

      if (!receipt) {
        throw makeError('transaction did not complete', 'UNKNOWN_ERROR');
      }

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Regimen.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Checks if a token is eligible to vote.
   * @param {string} token - The address of the token contract.
   * @returns {Promise<IStateChangeResult<boolean>>} A promise that resolves to the transaction and the result.
   * @public
   */
  public async canVote(token: string): Promise<boolean> {
    const _functionName = 'canVote';

    try {
      return await this._contract.canVote(token);
    } catch (error) {
      this._logger.error(`${Regimen.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Removes the ability for a token to vote.
   * @param {string} token - The address of the token contract.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async removeToken(token: string): Promise<IStateChangeResult<null>> {
    const _functionName = 'removeToken';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.removeToken(token);
      receipt = await response.wait();

      if (!receipt) {
        throw makeError('transaction did not complete', 'UNKNOWN_ERROR');
      }

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Regimen.name}#${_functionName}:`, error);

      throw error;
    }
  }
}
