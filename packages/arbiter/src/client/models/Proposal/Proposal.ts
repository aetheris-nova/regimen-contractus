import type { ILogger, INewClientOptions, TAttachClientOptions } from '@aetherisnova/regimen-contractus-types';
import { createLogger } from '@aetherisnova/regimen-contractus-utils';
import { BaseContract, Provider } from 'ethers';

// artifacts
import proposalArtifact from '@dist/contracts/Proposal.sol/Proposal.json';

// types
import type { IProposal, IProposalContract, IVoteResult } from '@client/types';

export default class Proposal {
  protected _address: string;
  protected _contract: IProposalContract;
  protected _debug: boolean;
  protected readonly _logger: ILogger;
  protected _provider: Provider;

  private constructor({ address, contract, debug = false, logger, provider }: INewClientOptions<IProposalContract>) {
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
  }: TAttachClientOptions): Promise<Proposal> {
    return new Proposal({
      address,
      contract: new BaseContract(
        address,
        proposalArtifact.abi,
        await provider.getSigner(signerAddress)
      ) as IProposalContract,
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
    return this._address.toLowerCase();
  }

  /**
   * Gets a proposal details.
   * @returns {Promise<IProposal>} A promise that resolves to the proposal details.
   * @public
   */
  public async details(): Promise<IProposal> {
    const _functionName = 'details';

    try {
      const [canceled, duration, executed, proposer, start, title] = await this._contract.details();

      return {
        canceled,
        duration,
        executed,
        id: this._address,
        proposer,
        start,
        title,
      };
    } catch (error) {
      this._logger.error(`${Proposal.name}#${_functionName}:`, error);

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
      this._logger.error(`${Proposal.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the current voting results.
   * @returns {Promise<IVoteResult>} A promise to the current voting position.
   * @public
   */
  public async voteResults(): Promise<IVoteResult> {
    const _functionName = 'voteResults';

    try {
      const [accept, abstain, reject] = await this._contract.voteResults();

      return {
        accept,
        abstain,
        reject,
      };
    } catch (error) {
      this._logger.error(`${Proposal.name}#${_functionName}:`, error);

      throw error;
    }
  }
}
