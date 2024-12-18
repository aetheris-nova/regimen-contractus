import type {
  ILogger,
  INewClientOptions,
  IStateChangeResult,
  TAttachClientOptions,
  TDeployClientOptions,
} from '_types';
import { createLogger } from '_utils';
import {
  BadDataError,
  BaseContract,
  ContractFactory,
  ContractTransactionReceipt,
  type ContractTransactionResponse,
  keccak256,
  makeError,
  Provider,
  Signer,
  toUtf8Bytes,
} from 'ethers';

// artifacts
import arbiterArtifact from '@dist/contracts/Arbiter.sol/Arbiter.json';
import proposalArtifact from '@dist/contracts/Proposal.sol/Proposal.json';

// enums
import { Roles } from '@client/enums';

// types
import type { IArbiterContract, IProposal, IProposalContract } from '@client/types';

export default class Arbiter {
  protected _address: string;
  protected _contract: IArbiterContract;
  protected _debug: boolean;
  protected readonly _logger: ILogger;
  protected _provider: Provider;

  private constructor({ address, contract, debug = false, logger, provider }: INewClientOptions<IArbiterContract>) {
    this._address = address;
    this._contract = contract;
    this._debug = debug;
    this._logger = logger;
    this._provider = provider;
  }

  /**
   * public static methods
   */

  public static async attach({
    debug = false,
    address,
    provider,
    signerAddress,
    silent = false,
  }: TAttachClientOptions): Promise<Arbiter> {
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

  public static async deploy({
    debug = false,
    provider,
    silent = false,
    signerAddress,
  }: TDeployClientOptions): Promise<Arbiter> {
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

  /**
   * public methods
   */

  /**
   * Gets the contract's address.
   * @returns {string} The contract address.
   * @public
   */
  public address(): string {
    return this._address.toLowerCase();
  }

  /**
   * Adds executor privileges for an address. Only admins can assign/remove executor privileges.
   * @param {string} address - The address to add executor privileges for.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async addExecutor(address: string): Promise<IStateChangeResult<null>> {
    const _functionName = 'addExecutor';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.grantRole(keccak256(toUtf8Bytes(Roles.Executor)), address);
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
   * Cancels a proposal.
   * @param {string} proposal - The proposal's contract address.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async cancel(proposal: string): Promise<IStateChangeResult<null>> {
    const _functionName = 'cancel';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.cancel(proposal);
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
    const _functionName = 'eligibility';

    try {
      return await this._contract.eligibility(token);
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Executes a proposal.
   * @param {string} proposal - The proposal's contract address.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async execute(proposal: string): Promise<IStateChangeResult<null>> {
    const _functionName = 'cancel';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.execute(proposal);
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
   * Checks if an address has executor privileges.
   * @param {string} address - The address to check.
   * @returns {Promise<boolean>} A promise that resolves to true if the address has executor privileges, false
   * otherwise.
   * @public
   */
  public async isExecutor(address: string): Promise<boolean> {
    const _functionName = 'isExecutor';

    try {
      return await this._contract.hasRole(keccak256(toUtf8Bytes(Roles.Executor)), address);
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
   * Removes executor privileges for an address. Only admins can assign/remove executor privileges.
   * @param {string} address - The address to removes executor privileges.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async removeExecutor(address: string): Promise<IStateChangeResult<null>> {
    const _functionName = 'removeExecutor';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.revokeRole(keccak256(toUtf8Bytes(Roles.Executor)), address);
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

  /**
   * Gets the version of the contract.
   * @returns {Promise<string>} A promise that resolves to the version of the contract.
   * @public
   */
  public async version(): Promise<string> {
    const _functionName = 'version';

    try {
      return await this._contract.version();
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${_functionName}:`, error);

      throw error;
    }
  }
}
