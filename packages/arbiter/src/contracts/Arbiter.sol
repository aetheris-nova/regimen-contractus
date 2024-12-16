// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { IERC721 } from 'forge-std/interfaces/IERC721.sol';
import { AccessControl } from 'openzeppelin-contracts/contracts/access/AccessControl.sol';

// contracts
import { IProposal } from './IProposal.sol';
import { Proposal } from './Proposal.sol';

/**
 * @title Arbiter
 * @notice The Arbiter contract oversees the submission and voting of proposals. It delegates the voting to the
 * individual tokens.
 * @dev The contract maintains a list of allowed tokens and toggles a boolean if it adds or removes a token.
 */
contract Arbiter is AccessControl {
  // roles
  bytes32 public constant EXECUTOR_ROLE = keccak256('EXECUTOR_ROLE');

  // variables
  mapping(address => bool) internal _allowedTokens;

  // events
  event ProposalCreated(address contractAddress, address proposer, uint48 start, uint32 duration);
  event TokenAdded(address indexed token);
  event TokenRemoved(address indexed token);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
   * @dev This will deploy a new proposal contract with the arbiter as owner.
   * @param proposer The address of the proposer; the token holder.
   * @param title The title of the proposal. Must be less that 256 characters.
   * @param start The timestamp (in seconds) of when the voting will start. Must be now, or a future date.
   * @param duration The length of time the voting for the proposal will last.
   * @return The created proposal contract address.
   */
  function propose(address proposer, string memory title, uint48 start, uint32 duration) external returns (address) {
    require(_allowedTokens[msg.sender], 'TOKEN_NOT_ELIGIBLE');
    require(bytes(title).length <= 256, 'TITLE_TOO_LONG');
    require(start >= block.timestamp, 'START_TIME_IN_PAST');

    Proposal proposalContract = new Proposal(proposer, title, start, duration);
    address proposal = address(proposalContract);

    emit ProposalCreated(proposal, proposer, start, duration);

    return proposal;
  }

  /**
   * @notice Removes the ability for a token to vote.
   * @param token The token address to remove.
   */
  function removeToken(address token) external {
    _allowedTokens[token] = false;

    emit TokenRemoved(token);
  }

  /**
   * @notice Votes for a proposal.
   * @dev This can only be called from an allowed sigillum (token).
   * @param voter The address of the voter.
   * @param proposal The address of the proposal.
   * @param choice The choice of the voter. Should be one of: Abstain = 0, Accept = 1, Reject = 2.
   */
  function vote(address voter, address proposal, uint8 choice) external {
    require(_allowedTokens[msg.sender], 'TOKEN_NOT_ELIGIBLE');

    IProposal proposalContract = IProposal(proposal);

    proposalContract.vote(voter, choice);
  }
}
