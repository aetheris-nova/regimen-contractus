// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { Arbiter } from '@aetherisnova/arbiter/Arbiter.sol';
import { IArbiter } from '@aetherisnova/arbiter/IArbiter.sol';
import { AccessControl } from 'openzeppelin-contracts/contracts/access/AccessControl.sol';
import { Base64 } from 'openzeppelin-contracts/contracts/utils/Base64.sol';
import { ERC721 } from 'solmate/tokens/ERC721.sol';

contract Sigillum is ERC721, AccessControl {
  // roles
  bytes32 public constant ISSUER_ROLE = keccak256('ISSUER_ROLE');

  // public variables
  address public arbiter;
  uint256 public currentTokenID;
  string public description;
  uint256 public supply;

  // events
  event ArbiterUpdated(address arbiter);

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _description,
    address _arbiter
  ) ERC721(_name, _symbol) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ISSUER_ROLE, msg.sender);

    arbiter = _arbiter;
    description = _description;
    supply = 0;
  }

  /**
   * external functions - read
   */

  function contractURI() external view returns (string memory) {
    return
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            abi.encodePacked(
              '{',
              '"arbiter": "',
              arbiter,
              '",',
              '"description": "',
              description,
              '",',
              '"name": "',
              name,
              '",',
              '"symbol": "',
              symbol,
              '"',
              '}'
            )
          )
        )
      );
  }

  function supportsInterface(bytes4 interfaceId) external view virtual override(AccessControl, ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 id) external view virtual override returns (string memory) {
    require(_ownerOf[id] != address(0), 'TOKEN_DOES_NOT_EXIST');

    return
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            abi.encodePacked(
              '{',
              '"arbiter": "',
              arbiter,
              '",',
              '"description": "',
              description,
              '",',
              '"id": ',
              id,
              ',',
              '"name": "',
              name,
              '",',
              '"symbol": "',
              symbol,
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

  function burn(uint256 id) external onlyRole(ISSUER_ROLE) {
    require(_ownerOf[id] != address(0), 'TOKEN_DOES_NOT_EXIST');

    _burn(id);

    supply = supply - 1;
  }

  function mint(address recipient) external onlyRole(ISSUER_ROLE) returns (uint256) {
    uint256 newItemId;

    require(balanceOf(recipient) == 0, 'RECIPIENT_ALREADY_HAS_TOKEN');

    newItemId = currentTokenID + 1;

    _safeMint(recipient, newItemId);

    currentTokenID = newItemId;
    supply = supply + 1;

    return newItemId;
  }

  /**
   * @notice Calls the arbiter contract and submits the proposal.
   * @param title The title of the proposal. Must be less that 256 characters.
   * @param start The timestamp (in seconds) of when the voting will start. Must be now, or a future date.
   * @param duration The length of time the voting for the proposal will last.
   * @return The created proposal ID.
   */
  function propose(string memory title, uint48 start, uint32 duration) external returns (bytes32) {
    require(bytes(title).length <= 256, 'TITLE_TOO_LONG');
    require(start >= block.timestamp, 'START_TIME_MUST_BE_IN_THE_FUTURE');

    IArbiter memory arbiterContract = IArbiter(arbiter);

    return arbiterContract.propose(msg.sender, title, start, duration);
  }

  /**
   * @notice Updates the arbiter contract that allows for submission of proposals and voting of proposals.
   * @dev Emits a an `ArbiterUpdated(address)` event.
   * @param _arbiter The new arbiter contract address.
   */
  function setArbiter(address _arbiter) external onlyRole(ISSUER_ROLE) {
    arbiter = _arbiter;

    emit ArbiterUpdated(_arbiter);
  }
}
