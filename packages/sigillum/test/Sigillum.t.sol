// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { Test } from "forge-std/Test.sol";
import { Base64 } from "openzeppelin-contracts/contracts/utils/Base64.sol";

// contracts
import { Sigillum, OwnerAlreadyHasToken } from '../src/Sigillum.sol';

contract SigillumTest is Test {
  Sigillum public token;

  function setUp() public {
    token = new Sigillum(
      "Sigillum Ordo Administratorum",
      "SOA",
      "The Sigillum that proves membership to the Ordo Administratorum."
    );
  }

  function test_Burn() public {
    // arrange
    uint256 newTokenID = token.mint(address(1));

    // act
    token.burn(newTokenID);

    // assert
    assertEq(token.balanceOf(address(1)), 0);
  }

  function test_MintToNewOwner() public {
    // arrange
    // act
    uint256 newTokenID = token.mint(address(1));

    // assert
    assertEq(token.ownerOf(newTokenID), address(1));
  }

  function test_OnlyAllowOneOwner() public {
    // arrange
    token.mint(address(1));

    // assert
    vm.expectRevert(OwnerAlreadyHasToken.selector);

    // act
    token.mint(address(1));
  }
}
