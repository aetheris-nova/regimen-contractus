import type { ILogger, IStateChangeResult } from '_types';
import { createLogger } from '_utils';
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
} from 'ethers';

// artifacts
import artifact from '@dist/contracts/Sigillum.sol/Sigillum.json';

// types
import type { IContractMetadata, ISigillumContract } from '@client/types';
import type { IDeployOptions, IInitOptions, INewOptions } from './types';

export default class Sigillum {
  protected _contract: ISigillumContract;
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
    description,
    name,
    provider,
    silent = false,
    signerAddress,
    symbol,
  }: IDeployOptions): Promise<Sigillum> {
    const _functionName = 'deploy';
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
      contract = (await contractFactory.deploy(name, symbol, description)) as ISigillumContract;

      await contract.waitForDeployment();

      deployTransaction = contract.deploymentTransaction();

      debug &&
        logger.debug(
          `${Sigillum.name}#${_functionName}: deployed contract using "${creatorAddress}" with transaction hash "${deployTransaction?.hash ?? '-'}" on chain "${deployTransaction?.chainId ?? '-'}"`
        );

      return new Sigillum({
        address: await contract.getAddress(),
        contract,
        debug,
        logger,
      });
    } catch (error) {
      logger.error(`${Sigillum.name}#${_functionName}: failed to deploy contract`, error);

      throw error;
    }
  }

  public static async init({
    debug = false,
    address,
    provider,
    signerAddress,
    silent = false,
  }: IInitOptions): Promise<Sigillum> {
    return new Sigillum({
      address,
      contract: new BaseContract(address, artifact.abi, await provider.getSigner(signerAddress)) as ISigillumContract,
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
   * Mints a new token to the recipient.
   * @param {string} recipient - The address of the recipient.
   * @returns {Promise<IStateChangeResult<bigint>>} A promise that resolves to the transaction and the new token ID.
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
}
