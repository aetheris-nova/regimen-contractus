// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

interface IProposal {
  function execute() external;
  function cancel() external;
  function vote(address voter, uint8 choice) external;
}
