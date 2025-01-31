import { type Hex, keccak256, toHex } from 'viem';

/**
 * Convenience function that parses the hashed rank and checks if it matches a rank, if it does, it returns the rank.
 * @param {<RankType extends Record<string, string>>} rankEnum - The rank enum.
 * @param {Hex} hashedRank - the hashed rank.
 * @returns {RankType[keyof RankType] | null} The rank or null if no ranks match the hashed rank.
 */
export default function parseHashedRank<RankType extends Record<string, string>>(
  rankEnum: RankType,
  hashedRank: Hex
): RankType[keyof RankType] | null {
  return (Object.values(rankEnum).find((value) => keccak256(toHex(value)) === hashedRank) || null) as
    | RankType[keyof RankType]
    | null;
}
