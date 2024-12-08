// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.13;

import { Test, console } from 'forge-std/Test.sol';

// contracts
import { Sigillum } from '../src/Sigillum.sol';

contract SigillumTest is Test {
  Sigillum public token;

  function setUp() public {
    token = new Sigillum(
      "Sigillum Ordo Administratorum",
      "SOA"
    );
  }
}
