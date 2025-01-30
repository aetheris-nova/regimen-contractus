import type { INewClientOptions, TAttachClientOptions } from '@aetherisnova/regimen-contractus-types';
import type { ILogger } from '@aetherisnova/types';
import { createLogger } from '@aetherisnova/utils';
import { type Config as WagmiConfig, readContract } from '@wagmi/core';
import type { Address } from 'viem';

// artifacts
import { proposalAbi as abi } from '@client/abis';

// types
import type { IProposal, IVoteResult } from '@client/types';

export default class Proposal {
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
  }: TAttachClientOptions): Promise<Proposal> {
    return new Proposal({
      address,
      debug,
      logger: createLogger(debug ? 'debug' : silent ? 'silent' : 'error'),
      wagmiConfig,
    });
  }

  /**
   * public methods
   */

  /**
   * Gets the contract's address.
   * @returns {Address} The contract address.
   * @public
   */
  public address(): Address {
    return this._address.toLowerCase() as Address;
  }

  /**
   * Gets a proposal details.
   * @returns {Promise<IProposal>} A promise that resolves to the proposal details.
   * @public
   */
  public async details(): Promise<IProposal> {
    const __function = 'details';

    try {
      const [canceled, duration, executed, proposer, start, title] = await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'details',
      });

      return {
        canceled,
        duration: BigInt(duration),
        executed,
        id: this._address,
        proposer,
        start: BigInt(start),
        title,
      };
    } catch (error) {
      this._logger.error(`${Proposal.name}#${__function}:`, error);

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
      this._logger.error(`${Proposal.name}#${__function}:`, error);

      throw error;
    }
  }

  /**
   * Gets the current voting results.
   * @returns {Promise<IVoteResult>} A promise to the current voting position.
   * @public
   */
  public async voteResults(): Promise<IVoteResult> {
    const __function = 'voteResults';

    try {
      const [accept, abstain, reject] = await readContract(this._wagmiConfig, {
        abi,
        address: this._address,
        functionName: 'voteResults',
      });

      return {
        accept: BigInt(accept),
        abstain: BigInt(abstain),
        reject: BigInt(reject),
      };
    } catch (error) {
      this._logger.error(`${Proposal.name}#${__function}:`, error);

      throw error;
    }
  }
}
