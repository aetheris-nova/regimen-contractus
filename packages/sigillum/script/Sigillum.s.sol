// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.13;

import { Script, console } from 'forge-std/Script.sol';

// contracts
import { Sigillum } from '../src/Sigillum.sol';

contract CounterScript is Script {
  Sigillum public token;

  function setUp() public {}

  function run() public {
    vm.startBroadcast();

    token = new Sigillum(
      "Sigillum Ordo Administratorum",
      "SOA"
    );

    vm.stopBroadcast();
  }
}
