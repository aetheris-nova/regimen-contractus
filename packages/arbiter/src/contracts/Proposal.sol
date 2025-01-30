// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

import { Ownable } from '@openzeppelin-contracts/access/Ownable.sol';

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
    uint8 vote; // abstain = 0, accept = 1, reject = 2
    bool voted;
  }

  // variables
  mapping(bytes32 => Vote) internal _votes;
  uint32 public abstainVotes;
  uint32 public acceptVotes;
  ProposalDetails public details;
  uint32 public rejectVotes;

  // events
  event Voted(address token, uint256 tokenID);
  event ProposalCanceled();
  event ProposalExecuted();

  constructor(address proposer, string memory title, uint48 start, uint32 duration) Ownable(msg.sender) {
    details = ProposalDetails(false, duration, false, proposer, start, title);
    abstainVotes = 0;
    acceptVotes = 0;
    rejectVotes = 0;
  }

  /**
   * internal functions - read
   */

  /**
   * @notice Creates an ID for a voter.
   * @dev
   * * The ID is a deterministic hash of the token address and the token's ID.
   * @return The index for a given voter.
   */
  function _createVoterID(address token, uint256 tokenID) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(token, tokenID));
  }

  /**
   * external functions - read
   */

  /**
   * @notice Gets the vote status for a given token.
   * @dev
   * * This *MUST* be called from the `Arbiter` contract.
   * @param token The address of the token.
   * @param tokenID The id of the voter's token.
   * @return The vote for the `voter`.
   */
  function hasVoted(address token, uint256 tokenID) external view onlyOwner returns (Vote memory) {
    return _votes[_createVoterID(token, tokenID)];
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
   * @notice Updates the state of the proposal to `executed`.
   * @dev
   * * This *MUST* be called from the `Arbiter` contract.
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
   * * This *MUST* be called from the `Arbiter` contract.
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
   * * This *MUST* be called from the `Arbiter` contract.
   * * This will revert if the voter has already voted.
   * * This will revert if the proposal has been canceled.
   * * This will revert if the proposal has been executed.
   * * If successful, a `Voted(address,uint256)` event will be emitted.
   * @param token The address of the token.
   * @param tokenID The id of the voter's token.
   * @param choice The choice of the voter. Should be one of: abstain = 0, accept = 1, reject = 2.
   */
  function vote(address token, uint256 tokenID, uint8 choice) external onlyOwner {
    bytes32 voterID = _createVoterID(token, tokenID);

    require(!_votes[voterID].voted, 'ALREADY_VOTED');
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

    _votes[voterID] = Vote(choice, true);

    emit Voted(token, tokenID);
  }

  /**
   * @notice Convenience function to get the vote results in one call.
   * @return A tuple with the accept votes, abstain votes and reject votes, respectively.
   */
  function voteResults() external view returns (uint32, uint32, uint32) {
    return (acceptVotes, abstainVotes, rejectVotes);
  }
}
