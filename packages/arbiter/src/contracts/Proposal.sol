// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

import { Ownable } from 'openzeppelin-contracts/contracts/access/Ownable.sol';

/**
 * @title Proposal
 * @notice The Proposal contract contains information about the proposal and the ballot of votes.
 * @dev This contract is deployed and maintained by the Arbiter. State changes **MUST** be done by the Arbiter contract.
 */
contract Proposal is Ownable {
  struct ProposalDetails {
    bool canceled;
    uint32 duration;
    bool executed;
    address proposer;
    uint48 start;
    string title;
  }
  struct Vote {
    uint8 vote; // Abstain = 0, Accept = 1, Reject = 2
    bool voted;
  }

  // variables
  mapping(address => Vote) internal _votes;
  uint32 public abstainVotes;
  uint32 public acceptVotes;
  ProposalDetails public details;
  uint32 public rejectVotes;

  // events
  event Voted(address indexed voter);
  event ProposalCanceled();
  event ProposalExecuted();

  constructor(address proposer, string memory title, uint48 start, uint32 duration) Ownable(msg.sender) {
    details = ProposalDetails(false, duration, false, proposer, start, title);
    abstainVotes = 0;
    acceptVotes = 0;
    rejectVotes = 0;
  }

  /**
   * external functions - read
   */

  function version() external pure returns (string memory) {
    return '1';
  }

  /**
   * external functions - write
   */

  /**
   * @notice Updates the state of the proposal to `executed`.
   * @dev
   * * The proposal cannot be executed if it has been canceled.
   * * If successful, a `ProposalExecuted()` event will be emitted.
   */
  function cancel() external onlyOwner {
    require(!details.executed, 'PROPOSAL_ALREADY_EXECUTED');

    if (!details.canceled) {
      details.canceled = true;

      emit ProposalCanceled();
    }
  }

  /**
   * @notice Updates the state of the proposal to `executed`.
   * @dev
   * * The proposal cannot be executed if it has been canceled.
   * * If successful, a `ProposalExecuted()` event will be emitted.
   */
  function execute() external onlyOwner {
    require(!details.canceled, 'PROPOSAL_ALREADY_CANCELED');

    if (!details.executed) {
      details.executed = true;

      emit ProposalExecuted();
    }
  }

  /**
   * @notice Submits a vote to the proposal.
   * @dev
   * * This will revert if the voter has already voted.
   * * This will revert if the proposal has been canceled.
   * * This will revert if the proposal has been executed.
   * * If successful, a `Voted(address)` event will be emitted.
   * @param voter The address of the voter.
   * @param choice The choice of the voter. Should be one of: Abstain = 0, Accept = 1, Reject = 2.
   */
  function vote(address voter, uint8 choice) external onlyOwner {
    require(!_votes[voter].voted, 'ALREADY_VOTED');
    require(choice <= 2, 'CHOICE_OUT_OF_BOUNDS');
    require(!details.canceled, 'PROPOSAL_ALREADY_CANCELED');
    require(!details.executed, 'PROPOSAL_ALREADY_EXECUTED');

    if (choice == 0) {
      abstainVotes = abstainVotes + 1;
    }

    if (choice == 1) {
      acceptVotes = acceptVotes + 1;
    }

    if (choice == 2) {
      rejectVotes = rejectVotes + 1;
    }

    _votes[voter] = Vote(choice, true);

    emit Voted(voter);
  }
}
