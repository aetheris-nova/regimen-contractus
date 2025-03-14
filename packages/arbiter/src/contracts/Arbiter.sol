// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

import { AccessControl } from '@openzeppelin-contracts/access/AccessControl.sol';

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
  bytes32 public constant CUSTODIAN_ROLE = keccak256('CUSTODIAN_ROLE');
  bytes32 public constant EXECUTOR_ROLE = keccak256('EXECUTOR_ROLE');

  // internal variables
  mapping(address => bool) internal _voterToken;

  // events
  event ProposalCreated(address contractAddress, address proposer, uint48 start, uint32 duration);
  event TokenAdded(address indexed token);
  event TokenRemoved(address indexed token);
  event Debug(string);

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(CUSTODIAN_ROLE, msg.sender);
    _grantRole(EXECUTOR_ROLE, msg.sender);
  }

  /**
   * modifier functions
   */

  modifier onlyTokenOwner() {
    require(_voterToken[msg.sender], 'TOKEN_NOT_ELIGIBLE');
    _;
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
    return _voterToken[token];
  }

  /**
   * @notice Gets the vote for a given token and proposal.
   * @dev
   * * This can only be called from an allowed sigillum (token).
   * @param tokenID The id of the voter's token.
   * @param proposal The proposal to check.
   * @return Whether the token has voted and what choice they made.
   */
  function hasVoted(uint256 tokenID, address proposal) external view onlyTokenOwner returns (uint8, bool) {
    IProposal proposalContract = IProposal(proposal);

    return proposalContract.hasVoted(msg.sender, tokenID);
  }

  /**
   * @notice Gets the version of the contract.
   * @return The version of the contract.
   */
  function version() external pure returns (string memory) {
    return '1';
  }

  /**
   * external functions - write
   */

  /**
   * @notice Sanctions a token to allow an account in possession of the token to vote.
   * @dev
   * * **MUST** have the `CUSTODIAN_ROLE`.
   * @param token The token address to add.
   */
  function addToken(address token) external onlyRole(CUSTODIAN_ROLE) {
    _voterToken[token] = true;

    emit TokenAdded(token);
  }

  /**
   * @notice Cancels a proposal.
   * @dev
   * * **MUST** have the `EXECUTOR_ROLE`.
   */
  function cancel(address proposal) external onlyRole(EXECUTOR_ROLE) {
    IProposal proposalContract = IProposal(proposal);

    proposalContract.cancel();
  }

  /**
   * @notice Executes a proposal.
   * @dev
   * * **MUST** have the `EXECUTOR_ROLE`.
   */
  function execute(address proposal) external onlyRole(EXECUTOR_ROLE) {
    IProposal proposalContract = IProposal(proposal);

    proposalContract.execute();
  }

  /**
   * @notice Allows a token to submit a proposal. If the token is not part of the allowed tokens, i.e. not a member of
   * the ordos, they will not be able to submit a proposal.
   * @dev
   * * **MUST** have the `CUSTODIAN_ROLE`.
   * * This will deploy a new proposal contract with the arbiter (this contract) as owner.
   * @param proposer The address of the proposer.
   * @param title The title of the proposal. Must be less that 256 characters.
   * @param start The timestamp (in seconds) of when the voting will start. Must be now, or a future date.
   * @param duration The length of time the voting for the proposal will last.
   * @return The created proposal contract address.
   */
  function propose(
    address proposer,
    string memory title,
    uint48 start,
    uint32 duration
  ) external onlyRole(CUSTODIAN_ROLE) returns (address) {
    require(bytes(title).length <= 256, 'TITLE_TOO_LONG');
    require(start >= block.timestamp, 'START_TIME_IN_PAST');

    Proposal proposalContract = new Proposal(proposer, title, start, duration);
    address proposal = address(proposalContract);

    emit ProposalCreated(proposal, proposer, start, duration);

    return proposal;
  }

  /**
   * @notice Removes the ability for a token to vote.
   * @dev
   * * **MUST** have the `CUSTODIAN_ROLE`.
   * @param token The token address to remove.
   */
  function removeToken(address token) external onlyRole(CUSTODIAN_ROLE) {
    _voterToken[token] = false;

    emit TokenRemoved(token);
  }

  /**
   * @notice Votes for a proposal.
   * @dev
   * * This can only be called from an allowed sigillum (token).
   * @param tokenID The id of the voter's token.
   * @param proposal The address of the proposal.
   * @param choice The choice of the voter. Should be one of: Abstain = 0, Accept = 1, Reject = 2.
   */
  function vote(uint256 tokenID, address proposal, uint8 choice) external onlyTokenOwner {
    IProposal proposalContract = IProposal(proposal);

    proposalContract.vote(msg.sender, tokenID, choice);
  }
}
