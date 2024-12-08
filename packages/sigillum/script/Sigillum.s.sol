// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Script, console } from 'forge-std/Script.sol';

// contracts
import { Sigillum } from '../src/Sigillum.sol';

contract CounterScript is Script {
  Sigillum public counter;

  function setUp() public {}

  function run() public {
    vm.startBroadcast();

    counter = new Sigillum();

    vm.stopBroadcast();
  }
}
