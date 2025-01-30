import type {
  INewClientOptions,
  TAttachClientOptions,
  TDeployClientOptions,
  IStateChangeResult,
} from '@aetherisnova/regimen-contractus-types';
import type { ILogger } from '@aetherisnova/types';
import { createLogger } from '@aetherisnova/utils';
import {
  type Config as WagmiConfig,
  getAccount,
  getChainId,
  deployContract,
  readContract,
  type WaitForTransactionReceiptReturnType,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { type Address, Hash, type Hex, keccak256, parseEventLogs, ParseEventLogsReturnType, toHex } from 'viem';

// artifacts
import { arbiterAbi as abi } from '@client/abis';
import { bytecode } from '@dist/contracts/Arbiter.sol/Arbiter.json';

// enums
import { Roles } from '@client/enums';

// types
import type { IProposeOptions } from '@client/types';

export default class Arbiter {
  protected _address: Address;
  protected _debug: boolean;
  protected readonly _logger: ILogger;
  protected _wagmiConfig: WagmiConfig;

  private constructor({ address, debug = false, logger, wagmiConfig }: INewClientOptions) {
    this._address = address;
    this._debug = debug;
    this._logger = logger;
    this._wagmiConfig = wagmiConfig;
  }

  /**
   * public static methods
   */

  public static async attach({
    debug = false,
    address,
    silent = false,
    wagmiConfig,
  }: TAttachClientOptions): Promise<Arbiter> {
    return new Arbiter({
      address,
      debug,
      logger: createLogger(debug ? 'debug' : silent ? 'silent' : 'error'),
      wagmiConfig,
    });
  }

  public static async deploy({ debug = false, silent = false, wagmiConfig }: TDeployClientOptions): Promise<Arbiter> {
    const __function = 'deploy';
    const logger = createLogger(debug ? 'debug' : silent ? 'silent' : 'error');
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await deployContract(wagmiConfig, {
        abi,
        bytecode: bytecode.object as Hex,
      });
      receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

      if (!receipt.contractAddress) {
        throw new Error('no contract address found');
      }

      debug &&
        logger.debug(
          `${Arbiter.name}#${__function}: deployed contract using "${getAccount(wagmiConfig).address}" with transaction hash "${hash ?? '-'}" on chain "${getChainId(wagmiConfig) ?? '-'}"`
        );

      return new Arbiter({
        address: receipt.contractAddress,
        debug,
        logger,
        wagmiConfig,
      });
    } catch (error) {
      logger.error(`${Arbiter.name}#${__function}: failed to deploy contract`, error);

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
  public address(): Address {
    return this._address.toLowerCase() as Address;
  }

  /**
   * Adds executor privileges for an address. Only admins can assign/remove executor privileges.
   * @param {Address} address - The address to add executor privileges for.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async addExecutor(address: Address): Promise<IStateChangeResult<null>> {
    const __function = 'addExecutor';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [keccak256(toHex(Roles.Executor)), address],
        functionName: 'grantRole',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Sanctions a token to allow an account in possession of the token to vote.
   * @param {Address} token - The address of the token contract.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async addToken(token: Address): Promise<IStateChangeResult<null>> {
    const __function = 'addToken';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [token],
        functionName: 'addToken',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Cancels a proposal.
   * @param {Address} proposal - The proposal's contract address.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async cancel(proposal: Address): Promise<IStateChangeResult<null>> {
    const __function = 'cancel';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [proposal],
        functionName: 'cancel',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Checks if a token is eligible to vote.
   * @param {Address} token - The address of the token contract.
   * @returns {Promise<boolean>} A promise that resolves to the transaction and the result.
   * @public
   */
  public async eligibility(token: Address): Promise<boolean> {
    const __function = 'eligibility';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [token],
        functionName: 'eligibility',
      });
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Executes a proposal.
   * @param {Address} proposal - The proposal's contract address.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async execute(proposal: Address): Promise<IStateChangeResult<null>> {
    const __function = 'cancel';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [proposal],
        functionName: 'execute',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

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
  public async isExecutor(address: Address): Promise<boolean> {
    const __function = 'isExecutor';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [keccak256(toHex(Roles.Executor)), address],
        functionName: 'hasRole',
      });
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Submits a new proposal to the arbiter contract.
   * @param {IProposeOptions} options - The proposer, title, start timestamp (in seconds) and the duration (in seconds).
   * @returns {Promise<IStateChangeResult<Address>>} A promise that resolves to the transaction and the proposal ID.
   * @public
   */
  public async propose({ duration, proposer, start, title }: IProposeOptions): Promise<IStateChangeResult<Address>> {
    const __function = 'propose';
    let logs: ParseEventLogsReturnType;
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [proposer, title, Number(start), Number(duration)],
        functionName: 'propose',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });
      logs = parseEventLogs({
        abi,
        eventName: 'ProposalCreated',
        logs: receipt.logs,
      });

      if (!logs[0]) {
        throw Error('no proposal created event emitted');
      }

      return {
        result: (logs[0].args as Record<'contractAddress', Address>).contractAddress,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Removes executor privileges for an address. Only admins can assign/remove executor privileges.
   * @param {Address} address - The address to removes executor privileges.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async removeExecutor(address: Address): Promise<IStateChangeResult<null>> {
    const __function = 'removeExecutor';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [keccak256(toHex(Roles.Executor)), address],
        functionName: 'revokeRole',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Removes the ability for a token to vote.
   * @param {Address} token - The address of the token contract.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async removeToken(token: Address): Promise<IStateChangeResult<null>> {
    const __function = 'removeToken';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [token],
        functionName: 'removeToken',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the version of the contract.
   * @returns {Promise<string>} A promise that resolves to the version of the contract.
   * @public
   */
  public async version(): Promise<string> {
    const __function = 'version';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'version',
      });
    } catch (error) {
      this._logger.error(`${Arbiter.name}#${__function}:`, error);

      throw error;
    }
  }
}
