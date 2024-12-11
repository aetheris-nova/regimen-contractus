// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { IERC721 } from 'forge-std/interfaces/IERC721.sol';
import { AccessControl } from 'openzeppelin-contracts/contracts/access/AccessControl.sol';

/**
 * @title Regimen
 * @notice The Regimen contract controls the submission and voting of proposals. It delegates the voting to the
 * individual tokens.
 * @dev The contract maintains a list of allowed tokens and toggles a boolean if it adds or removes a token.
 */
contract Regimen is AccessControl {
  // variables
  mapping(address => bool) internal _allowedTokens;

  // events
  event TokenAdded(address indexed token);
  event TokenRemoved(address indexed token);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /**
   * @notice Sanctions a token to allow an account in possession of the token to vote.
   * @param token The token address to add.
   */
  function addToken(address token) external {
    _allowedTokens[token] = true;

    emit TokenAdded(token);
  }

  /**
   * @notice Checks if a token is eligible to vote.
   * @param token The token address to check.
   * @return True if the token can vote, false otherwise.
   */
  function canVote(address token) external view returns (bool) {
    return _allowedTokens[token];
  }

  /**
   * @notice Removes the ability for a token to vote.
   * @param token The token address to remove.
   */
  function removeToken(address token) external {
    _allowedTokens[token] = false;

    emit TokenRemoved(token);
  }
}
