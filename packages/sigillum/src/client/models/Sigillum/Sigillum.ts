import type { ILogger } from '_types';
import { createLogger } from '_utils';
import { decode as decodeBase64 } from '@stablelib/base64';
import { decode as decodeUTF8 } from '@stablelib/utf8';
import { BaseContract, ContractFactory, type ContractTransactionResponse, Signer } from 'ethers';

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
    symbol,
    provider,
  }: IDeployOptions): Promise<Sigillum> {
    const _functionName = 'deploy';
    const logger = createLogger();
    let contract: ISigillumContract;
    let contractFactory: ContractFactory;
    let creatorAddress: string;
    let deployTransaction: ContractTransactionResponse | null;
    let signer: Signer;

    try {
      signer = await provider.getSigner();
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

  public static init({ debug = false, address, provider }: IInitOptions): Sigillum {
    return new Sigillum({
      address,
      contract: new BaseContract(address, artifact.abi, provider) as ISigillumContract,
      debug,
      logger: createLogger(),
    });
  }

  /**
   * public methods
   */

  public address(): string {
    return this._address;
  }

  public async contractURI(): Promise<string> {
    const _functionName = 'contractURI';

    try {
      return await this._contract.contractURI();
    } catch (error) {
      this._logger.error(`${Sigillum.name}#${_functionName}:`, error);

      throw error;
    }
  }

  public async contractMetadata(): Promise<IContractMetadata> {
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
