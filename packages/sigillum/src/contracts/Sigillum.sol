// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { AccessControl } from 'openzeppelin-contracts/contracts/access/AccessControl.sol';
import { Base64 } from 'openzeppelin-contracts/contracts/utils/Base64.sol';
import { ERC721 } from 'solmate/tokens/ERC721.sol';

contract Sigillum is ERC721, AccessControl {
  // roles
  bytes32 public constant ISSUER_ROLE = keccak256('ISSUER_ROLE');
  // tokens
  uint256 public currentTokenID;
  string public description;
  uint256 public supply;

  constructor(string memory _name, string memory _symbol, string memory _description) ERC721(_name, _symbol) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ISSUER_ROLE, msg.sender);

    description = _description;
    supply = 0;
  }

  function burn(uint256 id) public onlyRole(ISSUER_ROLE) {
    require(_ownerOf[id] != address(0), 'TOKEN_DOES_NOT_EXIST');

    _burn(id);

    supply = supply - 1;
  }

  function contractURI() external view returns (string memory) {
    return
      string(
        abi.encodePacked(
          'data:application/json;base64,',
          Base64.encode(
            abi.encodePacked(
              '{',
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

  function mint(address recipient) public onlyRole(ISSUER_ROLE) returns (uint256) {
    uint256 newItemId;

    require(balanceOf(recipient) == 0, 'RECIPIENT_ALREADY_HAS_TOKEN');

    newItemId = currentTokenID + 1;

    _safeMint(recipient, newItemId);

    currentTokenID = newItemId;
    supply = supply + 1;

    return newItemId;
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

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
