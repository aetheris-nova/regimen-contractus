// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

interface IRegimen {
  function hasVoted(uint256 tokenId) external view returns (bool);
  function markVoted(uint256 tokenId) external;
}
