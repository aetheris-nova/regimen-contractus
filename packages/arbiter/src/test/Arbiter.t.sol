// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { Test } from 'forge-std/Test.sol';

// contracts
import { Sigillum } from '@aetherisnova/sigillum/Sigillum.sol';
import { Arbiter } from '../src/contracts/arbiter.sol';

contract RegimenTest is Test {
  Arbiter public _contract;
  Sigillum public token;

  function setUp() public {
    _contract = new arbiter();
    token = new Sigillum(
      'Sigillum Ordo Administratorum',
      'SOA',
      'The Sigillum that proves membership to the Ordo Administratorum.'
    );
  }

  function test_CreateProposal() public {
    _contract.addToken(address(token));

    vm.expectRevert('RECIPIENT_ALREADY_HAS_TOKEN');

    // act
    token.mint(address(1));
  }
}
