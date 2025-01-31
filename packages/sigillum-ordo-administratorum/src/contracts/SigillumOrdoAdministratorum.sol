// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

import { Sigillum } from '@aetherisnova/sigillum/Sigillum.sol';

contract SigillumOrdoAdministratorum is Sigillum {
  // ranks
  bytes32 public constant ADEPTUS_RANK = keccak256('ADEPTUS_RANK'); // adepts
  bytes32 public constant NOVITIATE_RANK = keccak256('NOVITIATE_RANK'); // initiates
  bytes32 public constant PREFECTUS_RANK = keccak256('PREFECTUS_RANK'); // officers/managers

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _description,
    address _arbiter
  ) Sigillum(_name, _symbol, _description, _arbiter) {
    // mint the fist token with the deployer
    _mint(msg.sender, PREFECTUS_RANK);
  }

  /**
   * external functions - write
   */

  /**
   * @notice Burns a token.
   * @dev
   * * **MUST** have the `PREFECTUS_RANK`.
   * * This will error if the token does not exist.
   * * Emits a `Transfer(address,address,uint256)` event, where the `to` address is a zero address.
   * @param id The ID of the token to burn.
   */
  function burn(uint256 id) external override(Sigillum) onlyRank(PREFECTUS_RANK) {
    _burn(id);
  }

  /**
   * @notice Mints a new token.
   * @dev
   * * **MUST** have the `PREFECTUS_RANK`.
   * * This will error if the recipient already has a token.
   * * Emits a `Transfer(address,address,uint256)` event, where the `from` address is a zero address.
   * @param recipient The recipient of the token.
   * @param rank The rank to apply to the token.
   * @return The token ID.
   */
  function mint(
    address recipient,
    bytes32 rank
  ) external override(Sigillum) onlyRank(PREFECTUS_RANK) returns (uint256) {
    return _mint(recipient, rank);
  }

  /**
   * @notice Updates the arbiter contract that allows for submission of proposals and voting of proposals.
   * @dev
   * * **MUST** have the `PREFECTUS_RANK`.
   * * Emits an `ArbiterUpdated(address)` event.
   * @param _arbiter The new arbiter contract address.
   */
  function setArbiter(address _arbiter) external override(Sigillum) onlyRank(PREFECTUS_RANK) {
    _setArbiter(_arbiter);
  }
}
