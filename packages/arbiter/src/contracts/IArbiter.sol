// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

interface IArbiter {
  function hasVoted(uint256 tokenID, address proposal) external view returns (uint8, bool);
  function propose(address proposer, string memory title, uint48 start, uint32 duration) external returns (address);
  function vote(uint256 tokenID, address proposal, uint8 choice) external;
}
