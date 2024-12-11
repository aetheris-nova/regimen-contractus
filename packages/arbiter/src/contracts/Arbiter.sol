// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { IERC721 } from 'forge-std/interfaces/IERC721.sol';
import { AccessControl } from 'openzeppelin-contracts/contracts/access/AccessControl.sol';
import { Base64 } from 'openzeppelin-contracts/contracts/utils/Base64.sol';

/**
 * @title Arbiter
 * @notice The Arbiter contract controls the submission and voting of proposals. It delegates the voting to the
 * individual tokens.
 * @dev The contract maintains a list of allowed tokens and toggles a boolean if it adds or removes a token.
 */
contract Arbiter is AccessControl {
  struct ProposalDetails {
    bool canceled;
    uint32 duration;
    bool executed;
    address proposer;
    uint48 start;
    string title;
  }

  // roles
  bytes32 public constant EXECUTOR_ROLE = keccak256('EXECUTOR_ROLE');

  // variables
  mapping(address => bool) internal _allowedTokens;
  mapping(bytes32 proposalId => ProposalDetails) private _proposals;

  // events
  event ProposalCreated(bytes32 indexed id, address proposer, uint48 start, uint32 duration);
  event TokenAdded(address indexed token);
  event TokenRemoved(address indexed token);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /**
   * internal functions
   */

  /**
   * @notice Convenience function to generate a proposal ID from the proposal details.
   * @dev The proposal ID is 32 byte hash of the proposer, title, start timestamp and the duration.
   * @param proposal The proposal to create an ID from.
   * @return The proposal ID.
   */
  function _generateProposalID(ProposalDetails memory proposal) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(proposal.proposer, proposal.title, proposal.start, proposal.duration));
  }

  /**
   * @notice Convenience function to check if a proposal is empty.
   * @param proposal The proposal to check.
   * @return True if the proposal is empty, false otherwise.
   */
  function _isProposalEmpty(ProposalDetails memory proposal) internal pure returns (bool) {
    return proposal.proposer == address(0);
  }

  /**
   * @notice Convenience function convert a 32 byte array to a hex string.
   * @param data The data to convert to a hex string.
   * @return The data as a hex string.
   */
  function _toHexString(bytes32 data) internal pure returns (string memory) {
    bytes memory alphabet = '0123456789abcdef';
    bytes memory str = new bytes(64); // 32 bytes * 2 hex chars per byte = 64 chars

    for (uint256 i = 0; i < 32; i++) {
      uint8 byteValue = uint8(data[i]);
      str[2 * i] = alphabet[byteValue >> 4]; // high nibble
      str[2 * i + 1] = alphabet[byteValue & 0x0f]; // low nibble
    }

    return string(str);
  }

  /**
   * external functions - read
   */

  /**
   * @notice Checks if a token is eligible to vote.
   * @param token The token address to check.
   * @return True if the token can vote, false otherwise.
   */
  function eligibility(address token) external view returns (bool) {
    return _allowedTokens[token];
  }

  function proposalURI(bytes32 id) external view returns (string memory) {
    ProposalDetails memory proposal = _proposals[id];

    require(!_isProposalEmpty(proposal), 'PROPOSAL_DOES_NOT_EXIST');

    return
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            abi.encodePacked(
              '{',
              '"canceled": ',
              proposal.canceled,
              ',',
              '"duration": ',
              proposal.duration,
              ',',
              '"executed": ',
              proposal.executed,
              ',',
              '"id": "',
              _toHexString(id),
              '",',
              '"proposer": "',
              proposal.proposer,
              '",',
              '"start": ',
              proposal.start,
              '"title": "',
              proposal.title,
              '"',
              '}'
            )
          )
        )
      );
  }

  function version() external pure returns (string memory) {
    return '1';
  }

  /**
   * external functions - write
   */

  /**
   * @notice Sanctions a token to allow an account in possession of the token to vote.
   * @param token The token address to add.
   */
  function addToken(address token) external {
    _allowedTokens[token] = true;

    emit TokenAdded(token);
  }

  /**
   * @notice Allows a token to submit a proposal. If the token is not part of the allowed tokens, i.e. not a member of
   * the ordos, they will not be able to submit a proposal.
   * @dev The proposal ID will be a hash of the proposal details (see _generateProposalID()). A
   * `ProposalCreated(bytes32,address,uint48,uint32)` event will be emitted.
   * @param proposer The address of the proposer; the token holder.
   * @param title The title of the proposal. Must be less that 256 characters.
   * @param start The timestamp (in seconds) of when the voting will start. Must be now, or a future date.
   * @param duration The length of time the voting for the proposal will last.
   * @return The created proposal ID.
   */
  function propose(address proposer, string memory title, uint48 start, uint32 duration) external returns (bytes32) {
    require(_allowedTokens[msg.sender], 'TOKEN_NOT_ELIGIBLE');
    require(bytes(title).length <= 256, 'TITLE_TOO_LONG');
    require(start >= block.timestamp, 'START_TIME_MUST_BE_IN_THE_FUTURE');

    ProposalDetails memory proposal = ProposalDetails(false, duration, false, proposer, start, title);
    bytes32 proposalID = _generateProposalID(proposal);

    _proposals[proposalID] = proposal;

    emit ProposalCreated(proposalID, proposer, start, duration);

    return proposalID;
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
