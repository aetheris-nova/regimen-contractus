// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.24;

import { Arbiter } from '@aetherisnova/arbiter/Arbiter.sol';
import { IArbiter } from '@aetherisnova/arbiter/IArbiter.sol';
import { IProposal } from '@aetherisnova/arbiter/IProposal.sol';
import { Base64 } from '@openzeppelin-contracts/utils/Base64.sol';
import { Strings } from '@openzeppelin-contracts/utils/Strings.sol';
import { ERC721 } from 'solmate/tokens/ERC721.sol';

abstract contract Sigillum is ERC721 {
  struct Token {
    uint256 id;
    bytes32 rank;
  }

  // private variables
  mapping(address => Token) internal _tokenOf;

  // public variables
  address public arbiter;
  uint256 public currentTokenID; // starts at zero
  string public description;
  uint256 public supply;

  // events
  event ArbiterUpdated(address arbiter);
  event ProposalCreated(address proposal, address proposer, uint48 start, uint32 duration);

  // abstract methods
  function burn(uint256 id) external virtual;
  function mint(address recipient, bytes32 rank) external virtual returns (uint256);
  function setArbiter(address _arbiter) external virtual;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _description,
    address _arbiter
  ) ERC721(_name, _symbol) {
    arbiter = _arbiter;
    description = _description;
    supply = 0;
  }

  /**
   * modifier functions - write
   */

  modifier onlyOwnerOf(uint256 tokenID) {
    require(_ownerOf[tokenID] == msg.sender, 'NOT_OWNER_OF_TOKEN');
    _;
  }

  modifier onlyRank(bytes32 rank) {
    require(_tokenOf[msg.sender].rank == rank, 'INVALID_RANK');
    _;
  }

  /**
   * internal functions - read
   */

  /**
   * @notice Checks the `owner` does not already have a token. Reverts with an error of the owner already has a token.
   * @param owner The owner to check.
   */
  function _checkTokenOwnership(address owner) internal view {
    require(_tokenOf[owner].id == 0, 'RECIPIENT_ALREADY_HAS_TOKEN');
  }

  /**
   * @notice Transfers the Token struct `from` to `to`.
   * @param from The owner of the current token.
   * @param to The owner to transfer the token to.
   */
  function _transferToken(address from, address to) internal {
    Token memory token = _tokenOf[from];

    _tokenOf[to] = token;

    delete _tokenOf[from];
  }

  /**
   * internal functions - write
   */

  /**
   * @notice Burns a token.
   * @dev
   * * This will error if the token does not exist.
   * * Emits a `Transfer(address,address,uint256)` event, where the `to` address is a zero address.
   * @param id The ID of the token to burn.
   */
  function _burn(uint256 id) internal override(ERC721) {
    address owner = _ownerOf[id];

    require(owner != address(0), 'TOKEN_DOES_NOT_EXIST');

    super._burn(id);

    delete _tokenOf[owner];

    supply = supply - 1;
  }

  /**
   * @notice Mints a new token.
   * @dev
   * * This will error if the recipient already has a token.
   * * Emits a `Transfer(address,address,uint256)` event, where the `from` address is a zero address.
   * @param recipient The recipient of the token.
   * @return The token ID.
   */
  function _mint(address recipient, bytes32 rank) internal returns (uint256) {
    uint256 newItemId;

    // check the recipient does not already have a token
    _checkTokenOwnership(recipient);

    newItemId = currentTokenID + 1;

    _safeMint(recipient, newItemId);

    _tokenOf[recipient] = Token(newItemId, rank);
    currentTokenID = newItemId;
    supply = supply + 1;

    return newItemId;
  }

  /**
   * @notice Updates the arbiter contract that allows for submission of proposals and voting of proposals.
   * @dev
   * * Emits an `ArbiterUpdated(address)` event.
   * @param _arbiter The new arbiter contract address.
   */
  function _setArbiter(address _arbiter) internal {
    arbiter = _arbiter;

    emit ArbiterUpdated(_arbiter);
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
  function hasVoted(uint256 tokenID, address proposal) external view onlyOwnerOf(tokenID) returns (uint8, bool) {
    IArbiter arbiterContract = IArbiter(arbiter);

    return arbiterContract.hasVoted(tokenID, proposal);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
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
   * @notice Gets the token ID and rank for a given `owner`.
   * @dev
   * * `owner` *MUST NOT** be a zero address.
   * @param owner The owner to check.
   * @return Returns the token ID and the rank for the owner. If a token ID of 0 is returned, no token exists for the
   * owner.
   */
  function tokenOf(address owner) external view returns (Token memory) {
    require(owner != address(0), 'ZERO_ADDRESS');

    return _tokenOf[owner];
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

  function transferFrom(address from, address to, uint256 id) public override(ERC721) {
    // check the recipient does not already have a token
    _checkTokenOwnership(to);

    super.transferFrom(from, to, id);

    _transferToken(from, to);
  }

  function safeTransferFrom(address from, address to, uint256 id) public override(ERC721) {
    // check the recipient does not already have a token
    _checkTokenOwnership(to);

    super.safeTransferFrom(from, to, id);

    _transferToken(from, to);
  }

  function safeTransferFrom(address from, address to, uint256 id, bytes calldata data) public override(ERC721) {
    // check the recipient does not already have a token
    _checkTokenOwnership(to);

    super.safeTransferFrom(from, to, id, data);

    _transferToken(from, to);
  }

  /**
   * @notice Votes for a proposal.
   * @dev
   * * Sender **MUST** be the token holder.
   * @param tokenID The token ID.
   * @param proposal The address of the proposal.
   * @param choice The choice of the voter. Should be one of: Abstain = 0, Accept = 1, Reject = 2.
   */
  function vote(uint256 tokenID, address proposal, uint8 choice) external onlyOwnerOf(tokenID) {
    IArbiter arbiterContract = IArbiter(arbiter);

    arbiterContract.vote(tokenID, proposal, choice);
  }
}
