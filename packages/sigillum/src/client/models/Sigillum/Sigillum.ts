import type {
  ILogger,
  INewClientOptions,
  IStateChangeResult,
  TAttachClientOptions,
} from '@aetherisnova/regimen-contractus-types';
import { createLogger } from '@aetherisnova/regimen-contractus-utils';
import { decode as decodeBase64 } from '@stablelib/base64';
import { decode as decodeUTF8 } from '@stablelib/utf8';
import {
  BaseContract,
  ContractFactory,
  ContractTransactionReceipt,
  type ContractTransactionResponse,
  Interface,
  LogDescription,
  Signer,
  makeError,
  Provider,
} from 'ethers';

// artifacts
import artifact from '@dist/contracts/Sigillum.sol/Sigillum.json';

// types
import type { IContractMetadata, ISigillumContract, ITokenMetadata, IVoteResult } from '@client/types';
import type { IDeployOptions, IHasVotedOptions, IProposeOptions, IVoteOptions } from './types';

export default class Sigillum {
  protected _contract: ISigillumContract;
  protected _debug: boolean;
  protected _address: string;
  protected readonly _logger: ILogger;
  protected _provider: Provider;

  private constructor({ address, contract, debug = false, logger, provider }: INewClientOptions<ISigillumContract>) {
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
  }: TAttachClientOptions): Promise<Sigillum> {
    return new Sigillum({
      address,
      contract: new BaseContract(address, artifact.abi, await provider.getSigner(signerAddress)) as ISigillumContract,
      debug,
      logger: createLogger(debug ? 'debug' : silent ? 'silent' : 'error'),
      provider,
    });
  }

  public static async deploy({
    arbiter,
    debug = false,
    description,
    name,
    provider,
    silent = false,
    signerAddress,
    symbol,
  }: IDeployOptions): Promise<Sigillum> {
    const __function = 'deploy';
    const logger = createLogger(debug ? 'debug' : silent ? 'silent' : 'error');
    let contract: ISigillumContract;
    let contractFactory: ContractFactory;
    let creatorAddress: string;
    let deployTransaction: ContractTransactionResponse | null;
    let signer: Signer;

    try {
      signer = await provider.getSigner(signerAddress);
      creatorAddress = await signer.getAddress();
      contractFactory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
      contract = (await contractFactory.deploy(name, symbol, description, arbiter)) as ISigillumContract;

      await contract.waitForDeployment();

      deployTransaction = contract.deploymentTransaction();

      debug &&
        logger.debug(
          `${Sigillum.name}#${__function}: deployed contract using "${creatorAddress}" with transaction hash "${deployTransaction?.hash ?? '-'}" on chain "${deployTransaction?.chainId ?? '-'}"`
        );

      return new Sigillum({
        address: await contract.getAddress(),
        contract,
        debug,
        logger,
        provider,
      });
    } catch (error) {
      logger.error(`${Sigillum.name}#${__function}: failed to deploy contract`, error);

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
   * Gets the arbiter contract.
   * @returns {string} The arbiter contract address.
   * @public
   */
  public async arbiter(): Promise<string> {
    const _functionName = 'arbiter';

    try {
      return await this._contract.arbiter();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

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
    const _functionName = 'burn';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.burn(id);
      receipt = await response.wait();

      if (!receipt) {
        throw makeError('transaction did not complete', 'UNKNOWN_ERROR');
      }

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

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
    const _functionName = 'contractURI';

    try {
      return await this._contract.contractURI();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the contract metadata as a JSON.
   * @returns {Promise<IContractMetadata>} A promise that resolves to the contract metadata.
   * @public
   */
  public async contractMetadata<Result = IContractMetadata>(): Promise<Result> {
    const _functionName = 'contractMetadata';

    try {
      const dataURI = await this._contract.contractURI();
      const decodedMetadata = decodeBase64(dataURI.split(',')[1]);

      return JSON.parse(decodeUTF8(decodedMetadata));
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the description of the token.
   * @returns {Promise<string>} A promise that resolves to the description of the token.
   * @public
   */
  public async description(): Promise<string> {
    const _functionName = 'description';

    try {
      return await this._contract.description();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the vote for a given `proposal`.
   * @param {IHasVotedOptions} options - The token ID and the address of the proposal.
   * @returns {Promise<IVoteResult>} A promise that resolves to the vote result for the proposal.
   * @public
   */
  public async hasVoted({ proposal, tokenID }: IHasVotedOptions): Promise<IVoteResult> {
    const _functionName = 'hasVoted';

    try {
      const [choice, voted] = await this._contract.hasVoted(tokenID, proposal);

      return {
        choice: Number(choice),
        proposal,
        voted,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Mints a new token to the recipient.
   * @param {string} recipient - The address of the recipient.
   * @returns {Promise<IStateChangeResult<bigint>>} A promise that resolves to the transaction and the new token ID.
   * @public
   */
  public async mint(recipient: string): Promise<IStateChangeResult<bigint>> {
    const _functionName = 'mint';
    let contractInterface: Interface;
    let log: LogDescription | null;
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.mint(recipient);
      receipt = await response.wait();

      if (!receipt) {
        throw makeError('transaction did not complete', 'UNKNOWN_ERROR');
      }

      contractInterface = new Interface(artifact.abi);
      log = receipt.logs.reduce((acc, value) => {
        try {
          const parsedLog = contractInterface.parseLog(value);

          if (parsedLog?.name === 'Transfer') {
            return parsedLog;
          }

          return acc;
          /* eslint-disable @typescript-eslint/no-unused-vars */
          //  @typescript-eslint/no-unused-vars
        } catch (error) {
          return acc;
        }
        /* eslint-enable @typescript-eslint/no-unused-vars */
      }, null);

      if (!log) {
        throw makeError('failed to parse transfer event log', 'UNKNOWN_ERROR');
      }

      return {
        result: log.args[2], // Transfer(address,address,uint256)
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the name of the token.
   * @returns {Promise<string>} A promise that resolves to the name of the token.
   * @public
   */
  public async name(): Promise<string> {
    const _functionName = 'name';

    try {
      return await this._contract.name();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Submits a new proposal to the arbiter contract.
   * @param {IProposeOptions} options - The title, start timestamp (in seconds) and the duration (in seconds).
   * @returns {Promise<IStateChangeResult<string>>} A promise that resolves to the transaction and the proposal ID.
   * @public
   */
  public async propose({ duration, start, title }: IProposeOptions): Promise<IStateChangeResult<string>> {
    const _functionName = 'propose';
    let contractInterface: Interface;
    let log: LogDescription | null;
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.propose(title, start, duration);
      receipt = await response.wait();

      if (!receipt) {
        throw makeError('transaction did not complete', 'UNKNOWN_ERROR');
      }

      contractInterface = new Interface(artifact.abi);
      log = receipt.logs.reduce((acc, value) => {
        try {
          const parsedLog = contractInterface.parseLog(value);

          if (parsedLog?.name === 'ProposalCreated') {
            return parsedLog;
          }

          return acc;
          /* eslint-disable @typescript-eslint/no-unused-vars */
          //  @typescript-eslint/no-unused-vars
        } catch (error) {
          return acc;
        }
        /* eslint-enable @typescript-eslint/no-unused-vars */
      }, null);

      if (!log) {
        throw makeError('failed to parse proposal created event log', 'UNKNOWN_ERROR');
      }

      return {
        result: log.args[0], // ProposalCreated(address,address,uint48,uint32) - the proposal ID
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Updates the arbiter contract. Must have the `ISSUER_ROLE`.
   * @param {string} arbiter - The arbiter contract address.
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async setArbiter(arbiter: string): Promise<IStateChangeResult<null>> {
    const _functionName = 'setArbiter';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.setArbiter(arbiter);
      receipt = await response.wait();

      if (!receipt) {
        throw makeError('transaction did not complete', 'UNKNOWN_ERROR');
      }

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the current total supply of tokens.
   * @returns {Promise<bigint>} A promise that resolves to the current total supply of tokens.
   * @public
   */
  public async supply(): Promise<bigint> {
    const _functionName = 'supply';

    try {
      return await this._contract.supply();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the symbol for the token.
   * @returns {Promise<string>} A promise that resolves to the symbol of the token.
   * @public
   */
  public async symbol(): Promise<string> {
    const _functionName = 'symbol';

    try {
      return await this._contract.symbol();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

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
    const _functionName = 'tokenMetadata';

    try {
      const dataURI = await this._contract.tokenURI(id);
      const decodedMetadata = decodeBase64(dataURI.split(',')[1]);

      return JSON.parse(decodeUTF8(decodedMetadata));
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

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
    const _functionName = 'tokenURI';

    try {
      return await this._contract.tokenURI(id);
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Gets the version of the contract.
   * @returns {Promise<string>} A promise that resolves to the version.
   * @public
   */
  public async version(): Promise<string> {
    const _functionName = 'version';

    try {
      return await this._contract.version();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  /**
   * Votes for a proposal.
   * @param {IVoteOptions} options - The proposal contract address and a choice (Abstain = 0, Accept = 1, Reject = 2).
   * @returns {Promise<IStateChangeResult<null>>} A promise that resolves to the transaction.
   * @public
   */
  public async vote({ choice, proposal, tokenID }: IVoteOptions): Promise<IStateChangeResult<null>> {
    const _functionName = 'vote';
    let response: ContractTransactionResponse;
    let receipt: ContractTransactionReceipt | null;

    try {
      response = await this._contract.vote(tokenID, proposal, BigInt(choice));
      receipt = await response.wait();

      if (!receipt) {
        throw makeError('transaction did not complete', 'UNKNOWN_ERROR');
      }

      return {
        result: null,
        transaction: receipt,
      };
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }
}
