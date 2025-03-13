// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

interface ISigillum {
  function tokenOf(address owner) external view returns (uint256 id, bytes32 rank);
}
