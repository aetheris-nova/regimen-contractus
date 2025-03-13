import type {
  INewClientOptions,
  IStateChangeResult,
  TAttachClientOptions,
} from '@aetherisnova/regimen-contractus-types';
import type { ILogger } from '@aetherisnova/types';
import { createLogger } from '@aetherisnova/utils';
import { decode as decodeBase64 } from '@stablelib/base64';
import { decode as decodeUTF8 } from '@stablelib/utf8';
import {
  type Config as WagmiConfig,
  deployContract,
  getAccount,
  getChainId,
  readContract,
  waitForTransactionReceipt,
  type WaitForTransactionReceiptReturnType,
  writeContract,
} from '@wagmi/core';
import { Address, Hash, keccak256, parseEventLogs, ParseEventLogsReturnType, toHex } from 'viem';

// artifacts
import { sigillumAbi as abi } from '@client/abis';

// types
import type {
  IContractMetadata,
  IDeployOptions,
  IHasVotedOptions,
  ITokenMetadata,
  ITokenOfResponse,
  IVoteOptions,
  IVoteResult,
  TWithExtendedAttachOptions,
  TWithExtendedDeployOptions,
} from '@client/types';

export default class Sigillum {
  protected _debug: boolean;
  protected _address: Address;
  protected readonly _logger: ILogger;
  protected _wagmiConfig: WagmiConfig;

  protected constructor({ address, debug = false, logger, wagmiConfig }: INewClientOptions) {
    this._address = address;
    this._debug = debug;
    this._logger = logger;
    this._wagmiConfig = wagmiConfig;
  }

  /**
   * protected static methods
   */

  protected static async _attach<Class extends Sigillum>({
    address,
    Class,
    debug = false,
    silent = false,
    wagmiConfig,
  }: TWithExtendedAttachOptions<TAttachClientOptions>): Promise<Class> {
    return new Class({
      address,
      debug,
      logger: createLogger(debug ? 'debug' : silent ? 'silent' : 'error'),
      wagmiConfig,
    }) as Class;
  }

  protected static async _deploy<Class extends Sigillum>({
    abi: _abi,
    arbiter,
    bytecode,
    Class,
    debug = false,
    description,
    name,
    silent = false,
    symbol,
    wagmiConfig,
  }: TWithExtendedDeployOptions<IDeployOptions>): Promise<Class> {
    const __function = 'deploy';
    const logger = createLogger(debug ? 'debug' : silent ? 'silent' : 'error');
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await deployContract(wagmiConfig, {
        abi: _abi,
        args: [name, symbol, description, arbiter],
        bytecode,
      });
      receipt = await waitForTransactionReceipt(wagmiConfig, { hash });

      if (!receipt.contractAddress) {
        throw new Error('no contract address found');
      }

      debug &&
        logger.debug(
          `${Sigillum.name}#${__function}: deployed contract using "${getAccount(wagmiConfig).address}" with transaction hash "${hash}" on chain "${getChainId(wagmiConfig) ?? '-'}"`
        );

      return new Class({
        address: receipt.contractAddress,
        debug,
        logger,
        wagmiConfig,
      }) as Class;
    } catch (error) {
      logger.error(`${Sigillum.name}#${__function}: failed to deploy contract`, error);

      throw error;
    }
  }

  /**
   * protected methods
   */

  /**
   * Mints a new token to the recipient.
   * @param {Address} recipient - The address of the recipient.
   * @param {Rank} rank - The rank to give to the token.
   * @returns {Promise<IStateChangeResult<bigint>>} A promise that resolves to the transaction and the new token ID.
   * @public
   */
  protected async _mint<Rank extends string>(recipient: Address, rank: Rank): Promise<IStateChangeResult<bigint>> {
    const __function = 'mint';
    let logs: ParseEventLogsReturnType;
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [recipient, keccak256(toHex(rank))],
        functionName: 'mint',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });
      logs = parseEventLogs({
        abi,
        eventName: 'Transfer',
        logs: receipt.logs,
      });

      if (!logs[0]) {
        throw Error('no transfer event emitted');
      }

      return {
        result: (logs[0].args as Record<'id', bigint>).id,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the token ID and the rank for a given owner.
   * @param {Address} owner - The token ID.
   * @returns {Promise<ITokenOfResponse | null>} A promise that resolves to the token ID and rank or null if the owner
   * does not own a token.
   * @public
   */
  protected async _tokenOf(owner: Address): Promise<ITokenOfResponse | null> {
    const __function = 'symbol';

    try {
      const { id, rank } = await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [owner],
        functionName: 'tokenOf',
      });

      // if the token id is 0, the owner has not token
      if (id === BigInt(0)) {
        return null;
      }

      return {
        hashedRank: rank,
        id,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

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
   * Gets the arbiter contract.
   * @returns {string} The arbiter contract address.
   * @public
   */
  public async arbiter(): Promise<string> {
    const __function = 'arbiter';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'arbiter',
      });
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Burns the token by the ID.
   * @param {bigint} id - The ID of the token.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async burn(id: bigint): Promise<IStateChangeResult<null>> {
    const __function = 'burn';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [id],
        functionName: 'burn',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the contract URI. This will be in the format of a base64 encoded data URI.
   * @returns {Promise<string>} A promise that resolves the contract URI.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data}
   * @public
   */
  public async contractURI(): Promise<string> {
    const __function = 'contractURI';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'contractURI',
      });
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the contract metadata as a JSON.
   * @returns {Promise<IContractMetadata>} A promise that resolves to the contract metadata.
   * @public
   */
  public async contractMetadata<Result = IContractMetadata>(): Promise<Result> {
    const __function = 'contractMetadata';

    try {
      const dataURI = await this.contractURI();
      const decodedMetadata = decodeBase64(dataURI.split(',')[1]);

      return JSON.parse(decodeUTF8(decodedMetadata));
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the description of the token.
   * @returns {Promise<string>} A promise that resolves to the description of the token.
   * @public
   */
  public async description(): Promise<string> {
    const __function = 'description';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'description',
      });
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the vote for a given `proposal`.
   * @param {Address} proposal - The address of the proposal contract.
   * @returns {Promise<IVoteResult>} A promise that resolves to the vote result for the proposal.
   * @public
   */
  public async hasVoted(proposal: Address): Promise<IVoteResult> {
    const __function = 'hasVoted';

    try {
      const [choice, voted] = await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [proposal],
        functionName: 'hasVoted',
      });

      return {
        choice,
        proposal,
        voted,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the name of the token.
   * @returns {Promise<string>} A promise that resolves to the name of the token.
   * @public
   */
  public async name(): Promise<string> {
    const __function = 'name';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'name',
      });
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Updates the arbiter contract.
   * @param {Address} arbiter - The arbiter contract address.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async setArbiter(arbiter: Address): Promise<IStateChangeResult<null>> {
    const __function = 'setArbiter';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [arbiter],
        functionName: 'setArbiter',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the current total supply of tokens.
   * @returns {Promise<bigint>} A promise that resolves to the current total supply of tokens.
   * @public
   */
  public async supply(): Promise<bigint> {
    const __function = 'supply';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'supply',
      });
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the symbol for the token.
   * @returns {Promise<string>} A promise that resolves to the symbol of the token.
   * @public
   */
  public async symbol(): Promise<string> {
    const __function = 'symbol';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'symbol',
      });
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the token metadata.
   * @param {bigint} id - The token ID.
   * @returns {Promise<ITokenMetadata>} A promise that resolves the token metadata.
   * @public
   */
  public async tokenMetadata<Result = ITokenMetadata>(id: bigint): Promise<Result> {
    const __function = 'tokenMetadata';

    try {
      const dataURI = await this.tokenURI(id);
      const decodedMetadata = decodeBase64(dataURI.split(',')[1]);

      return JSON.parse(decodeUTF8(decodedMetadata));
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the token URI. This will be in the format of a base64 encoded data URI.
   * @param {bigint} id - The token ID.
   * @returns {Promise<string>} A promise that resolves the token URI.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data}
   * @public
   */
  public async tokenURI(id: bigint): Promise<string> {
    const __function = 'tokenURI';

    try {
      return await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [id],
        functionName: 'tokenURI',
      });
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the version of the contract.
   * @returns {Promise<string>} A promise that resolves to the version.
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
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Vote for a proposal.
   * @param {IVoteOptions} options - The proposal contract address and a choice (Abstain = 0, Accept = 1, Reject = 2).
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async vote({ choice, proposal }: IVoteOptions): Promise<IStateChangeResult<null>> {
    const __function = 'vote';
    let hash: Hash;
    let receipt: WaitForTransactionReceiptReturnType;

    try {
      hash = await writeContract(this._wagmiConfig, {
        abi,
        address: this._address,
        args: [proposal, choice],
        functionName: 'vote',
      });
      receipt = await waitForTransactionReceipt(this._wagmiConfig, { hash });

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${__function}:`, error);

      throw error;
    }
  }
}
