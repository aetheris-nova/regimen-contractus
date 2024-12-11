import type { ILogger, IStateChangeResult } from '_types';
import { createLogger } from '_utils';
import { decode as decodeBase64 } from '@stablelib/base64';
import { decode as decodeUTF8 } from '@stablelib/utf8';
import {
  BaseContract,
  CallExceptionError,
  ContractFactory,
  ContractTransactionReceipt,
  type ContractTransactionResponse,
  makeError,
  Signer,
} from 'ethers';

// artifacts
import artifact from '@dist/contracts/Arbiter.sol/Arbiter.json';

// errors
import { PROPOSAL_DOES_NOT_EXIST } from '@client/constants';

// types
import type { IArbiterContract, IProposal } from '@client/types';
import type { IDeployOptions, IInitOptions, INewOptions } from './types';

export default class Arbiter {
  protected _contract: IArbiterContract;
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
  }: IDeployOptions): Promise<Arbiter> {
    const _functionName = 'deploy';
    const logger = createLogger(debug ? 'debug' : silent ? 'silent' : 'error');
    let contract: IArbiterContract;
    let contractFactory: ContractFactory;
    let creatorAddress: string;
    let deployTransaction: ContractTransactionResponse | null;
    let signer: Signer;

    try {
      signer = await provider.getSigner(signerAddress);
      creatorAddress = await signer.getAddress();
      contractFactory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
      contract = (await contractFactory.deploy()) as IArbiterContract;

      await contract.waitForDeployment();

      deployTransaction = contract.deploymentTransaction();

      debug &&
        logger.debug(
          `${Arbiter.name}#${_functionName}: deployed contract using "${creatorAddress}" with transaction hash "${deployTransaction?.hash ?? '-'}" on chain "${deployTransaction?.chainId ?? '-'}"`
        );

      return new Arbiter({
        address: await contract.getAddress(),
        contract,
        debug,
        logger,
      });
    } catch (error) {
      logger.error(`${Arbiter.name}#${_functionName}: failed to deploy contract`, error);

      throw error;
    }
  }

  public static async init({
    debug = false,
    address,
    provider,
    signerAddress,
    silent = false,
  }: IInitOptions): Promise<Arbiter> {
    return new Arbiter({
      address,
      contract: new BaseContract(address, artifact.abi, await provider.getSigner(signerAddress)) as IArbiterContract,
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
      this._logger.error(`${Arbiter.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Checks if a token is eligible to vote.
   * @param {string} token - The address of the token contract.
   * @returns {Promise<IStateChangeResult<boolean>>} A promise that resolves to the transaction and the result.
   * @public
   */
  public async eligibility(token: string): Promise<boolean> {
    const _functionName = 'canVote';

    try {
      return await this._contract.eligibility(token);
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets a proposal by its ID.
   * @param {string} id - The hex-encoded proposal ID.
   * @returns {Promise<IProposal | null>} A promise that resolves to the proposal or null if the proposal does not
   * exist.
   * @public
   */
  public async proposalByID(id: string): Promise<IProposal | null> {
    const _functionName = 'proposalByID';
    let decodedData: Uint8Array;
    let dataURI: string;

    try {
      if (id.length > 64) {
        throw makeError('invalid id length, expected a 32 byte hex encoded string', 'UNKNOWN_ERROR');
      }

      dataURI = await this._contract.proposalURI(
        `0x${id}` // prefix with "0x"
      );
      decodedData = decodeBase64(dataURI.split(',')[1]);

      return JSON.parse(decodeUTF8(decodedData));
    } catch (error) {
      if (
        (error as CallExceptionError).code === 'CALL_EXCEPTION' &&
        (error as CallExceptionError).reason === PROPOSAL_DOES_NOT_EXIST
      ) {
        return null;
      }

      this._logger.error(`${Arbiter.name}#${_functionName}:`, error);

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
      this._logger.error(`${Arbiter.name}#${_functionName}:`, error);

      throw error;
    }
  }
}
