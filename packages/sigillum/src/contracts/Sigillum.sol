// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

import { Arbiter } from '@aetherisnova/arbiter/Arbiter.sol';
import { IArbiter } from '@aetherisnova/arbiter/IArbiter.sol';
import { IProposal } from '@aetherisnova/arbiter/IProposal.sol';
import { AccessControl } from '@openzeppelin-contracts/access/AccessControl.sol';
import { Base64 } from '@openzeppelin-contracts/utils/Base64.sol';
import { Strings } from '@openzeppelin-contracts/utils/Strings.sol';
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
  event ProposalCreated(address proposal, address proposer, uint48 start, uint32 duration);

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
              Strings.toHexString(arbiter),
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

  /**
   * @notice Gets the vote for a given `proposal`.
   * @dev
   * * Sender **MUST** be a token holder.
   * @param tokenID The token ID.
   * @param proposal The proposal to check.
   * @return Whether the sender has voted and what choice they made.
   */
  function hasVoted(uint256 tokenID, address proposal) external view returns (uint8, bool) {
    require(_ownerOf[tokenID] == msg.sender, 'NOT_OWNER_OF_TOKEN');

    IArbiter arbiterContract = IArbiter(arbiter);

    return arbiterContract.hasVoted(tokenID, proposal);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenURI(uint256 id) public view virtual override returns (string memory) {
    require(_ownerOf[id] != address(0), 'TOKEN_DOES_NOT_EXIST');

    return
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            abi.encodePacked(
              '{',
              '"arbiter": "',
              Strings.toHexString(arbiter),
              '",',
              '"description": "',
              description,
              '",',
              '"id": ',
              Strings.toString(id),
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
   * @notice Burns a token.
   * @dev
   * * **MUST** have the `ISSUER_ROLE`.
   * * This will error if the token does not exist.
   * * Emits a `Transfer(address,address,uint256)` event, where the `to` address is a zero address.
   * @param id The ID of the token to burn.
   */
  function burn(uint256 id) external onlyRole(ISSUER_ROLE) {
    require(_ownerOf[id] != address(0), 'TOKEN_DOES_NOT_EXIST');

    _burn(id);

    supply = supply - 1;
  }

  /**
   * @notice Mints a new token.
   * @dev
   * * **MUST** have the `ISSUER_ROLE`.
   * * This will error if the recipient already has a token.
   * * Emits a `Transfer(address,address,uint256)` event, where the `from` address is a zero address.
   * @param recipient The recipient of the token.
   * @return The token ID.
   */
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
   * @dev
   * * Sender **MUST** be a token holder.
   * * Emits a `ProposalCreated(address,address,uint48,uint32)` event.
   * @param title The title of the proposal. Must be less that 256 characters.
   * @param start The timestamp (in seconds) of when the voting will start. Must be now, or a future date.
   * @param duration The length of time the voting for the proposal will last.
   * @return The created proposal contract address.
   */
  function propose(string memory title, uint48 start, uint32 duration) external returns (address) {
    require(balanceOf(msg.sender) != 0, 'TOKEN_DOES_NOT_EXIST');
    require(bytes(title).length <= 256, 'TITLE_TOO_LONG');
    require(start >= block.timestamp, 'START_TIME_IN_PAST');

    IArbiter arbiterContract = IArbiter(arbiter);
    address proposal = arbiterContract.propose(msg.sender, title, start, duration);

    emit ProposalCreated(proposal, msg.sender, start, duration);

    return proposal;
  }

  /**
   * @notice Updates the arbiter contract that allows for submission of proposals and voting of proposals.
   * @dev
   * * **MUST** have the `ISSUER_ROLE`.
   * * Emits an `ArbiterUpdated(address)` event.
   * @param _arbiter The new arbiter contract address.
   */
  function setArbiter(address _arbiter) external onlyRole(ISSUER_ROLE) {
    arbiter = _arbiter;

    emit ArbiterUpdated(_arbiter);
  }

  /**
   * @notice Votes for a proposal.
   * @dev
   * * Sender **MUST** be the token holder.
   * @param tokenID The token ID.
   * @param proposal The address of the proposal.
   * @param choice The choice of the voter. Should be one of: Abstain = 0, Accept = 1, Reject = 2.
   */
  function vote(uint256 tokenID, address proposal, uint8 choice) external {
    require(_ownerOf[tokenID] == msg.sender, 'NOT_OWNER_OF_TOKEN');

    IArbiter arbiterContract = IArbiter(arbiter);

    arbiterContract.vote(tokenID, proposal, choice);
  }
}
