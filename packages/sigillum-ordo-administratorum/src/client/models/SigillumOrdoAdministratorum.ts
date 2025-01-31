import type { IStateChangeResult, TAttachClientOptions } from '@aetherisnova/regimen-contractus-types';
import { type IDeployOptions, Sigillum } from '@aetherisnova/sigillum';
import type { Address, Hex } from 'viem';

// artifacts
import { sigillumOrdoAdministratorumAbi as abi } from '@client/abis';
import { bytecode } from '@dist/contracts/SigillumOrdoAdministratorum.sol/SigillumOrdoAdministratorum.json';

// enums
import { RankEnum } from '@client/enums';

// utils
import { parseHashedRank } from '@client/utils';

export default class SigillumOrdoAdministratorum extends Sigillum {
  /**
   * public static methods
   */

  public static async attach(options: TAttachClientOptions): Promise<SigillumOrdoAdministratorum> {
    return SigillumOrdoAdministratorum._attach({
      Class: SigillumOrdoAdministratorum,
      ...options,
    });
  }

  public static async deploy(options: IDeployOptions): Promise<SigillumOrdoAdministratorum> {
    return SigillumOrdoAdministratorum._deploy({
      abi,
      bytecode: bytecode.object as Hex,
      Class: SigillumOrdoAdministratorum,
      ...options,
    });
  }

  /**
   * public methods
   */

  /**
   * Mints a new token to the recipient. Must have the `PREFECTUS_RANK` rank.
   * @param {Address} recipient - The address of the recipient.
   * @param {RankEnum} rank - The rank to give to the token.
   * @returns {Promise<IStateChangeResult<bigint>>} A promise that resolves to the transaction and the new token ID.
   * @public
   */
  public async mint(recipient: Address, rank: RankEnum): Promise<IStateChangeResult<bigint>> {
    return await this._mint<RankEnum>(recipient, rank);
  }

  /**
   * Gets the rank for a given owner.
   * @param {Address} owner - The address of the token owner.
   * @returns The token owner's rank or if the owner does not own a token, or the owner's rank is not a valid rank,
   * null is returned.
   * @public
   */
  public async rank(owner: Address): Promise<RankEnum | null> {
    const result = await this._tokenOf(owner);

    if (!result) {
      return null;
    }

    return parseHashedRank(RankEnum, result.hashedRank);
  }

  /**
   * Gets the token ID for a given owner.
   * @param {Address} owner - The owner of the token.
   * @returns {Promise<bigint | null>} A promise that resolves to the given token ID or null if the owner does not
   * have a token.
   * @public
   */
  public async tokenOf(owner: Address): Promise<bigint | null> {
    const result = await this._tokenOf(owner);

    if (!result) {
      return null;
    }

    return result.id;
  }
}
