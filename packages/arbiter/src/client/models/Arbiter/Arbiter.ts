import type { ILogger, IStateChangeResult } from '_types';
import { createLogger } from '_utils';
import { decode as decodeBase64 } from '@stablelib/base64';
import { decode as decodeUTF8 } from '@stablelib/utf8';
import {
  BadDataError,
  BaseContract,
  CallExceptionError,
  ContractFactory,
  ContractTransactionReceipt,
  type ContractTransactionResponse,
  getBytes,
  Log,
  makeError,
  Provider,
  Signer,
} from 'ethers';

// artifacts
import arbiterArtifact from '@dist/contracts/Arbiter.sol/Arbiter.json';
import proposalArtifact from '@dist/contracts/Proposal.sol/Proposal.json';

// errors
import { PROPOSAL_DOES_NOT_EXIST } from '@client/constants';

// types
import type { IArbiterContract, IProposal, IProposalContract } from '@client/types';
import type { IDeployOptions, IInitOptions, INewOptions } from './types';

export default class Arbiter {
  protected _address: string;
  protected _contract: IArbiterContract;
  protected _debug: boolean;
  protected readonly _logger: ILogger;
  protected _provider: Provider;

  private constructor({ address, contract, debug = false, logger, provider }: INewOptions) {
    this._address = address;
    this._contract = contract;
    this._debug = debug;
    this._logger = logger;
    this._provider = provider;
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
      contractFactory = new ContractFactory(arbiterArtifact.abi, arbiterArtifact.bytecode, signer);
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
        provider,
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
      contract: new BaseContract(
        address,
        arbiterArtifact.abi,
        await provider.getSigner(signerAddress)
      ) as IArbiterContract,
      debug,
      logger: createLogger(debug ? 'debug' : silent ? 'silent' : 'error'),
      provider,
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
   * Gets a proposal details by its contract address.
   * @param {string} address - The proposal's contract address.
   * @returns {Promise<IProposal | null>} A promise that resolves to the proposal or null if the proposal does not
   * exist.
   * @public
   */
  public async proposalByAddress(address: string): Promise<IProposal | null> {
    const _functionName = 'proposalByAddress';
    const proposalContract = new BaseContract(address, proposalArtifact.abi, this._provider) as IProposalContract;

    try {
      const [canceled, duration, executed, proposer, start, title] = await proposalContract.details();

      return {
        canceled,
        duration,
        executed,
        id: address,
        proposer,
        start,
        title,
      };
    } catch (error) {
      if ((error as BadDataError).code === 'BAD_DATA') {
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
