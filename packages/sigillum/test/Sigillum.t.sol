// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.13;

import { Test, console } from 'forge-std/Test.sol';

// contracts
import { Sigillum } from '../src/Sigillum.sol';

contract SigillumTest is Test {
  Sigillum public counter;

  function setUp() public {
    counter = new Sigillum();
    counter.setNumber(0);
  }

  function test_Increment() public {
    counter.increment();
    assertEq(counter.number(), 1);
  }

  function testFuzz_SetNumber(uint256 x) public {
    counter.setNumber(x);
    assertEq(counter.number(), x);
  }
}
