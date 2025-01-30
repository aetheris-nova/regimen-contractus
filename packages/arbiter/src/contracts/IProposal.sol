// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

interface IProposal {
  function cancel() external;
  function execute() external;
  function hasVoted(address token, uint256 tokenID) external view returns (uint8, bool);
  function vote(address token, uint256 tokenID, uint8 choice) external;
}
