import type { ILogger } from '_types';
import { createLogger } from '_utils';
import { BaseContract, ContractFactory, type ContractTransactionResponse, Signer } from 'ethers';

// artifacts
import artifact from '@dist/contracts/Sigillum.sol/Sigillum.json';

// types
import type { IDeployOptions, IInitOptions, INewOptions } from './types';

export default class Sigillum {
  protected _contract: BaseContract;
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
    let contract: BaseContract;
    let contractFactory: ContractFactory;
    let creatorAddress: string;
    let deployTransaction: ContractTransactionResponse | null;
    let signer: Signer;

    try {
      signer = await provider.getSigner();
      creatorAddress = await signer.getAddress();
      contractFactory = new ContractFactory(artifact.abi, artifact.bytecode, signer);
      contract = await contractFactory.deploy(name, symbol, description);

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
      contract: new BaseContract(address, artifact.abi, provider),
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
}
