// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { Test } from 'forge-std/Test.sol';

// contracts
import { Proposal } from '../src/contracts/Proposal.sol';

contract ProposalTest is Test {
  Proposal public _contract;

  function setUp() public {
    _contract = new Proposal(
      address(1),
      'Decree: Founding Of The Ordo Administratorum',
      uint48(block.timestamp),
      84000
    );
  }

  function test_VoteAbstain() public {
    assertEq(_contract.abstainVotes(), 0);

    _contract.vote(address(1), 0);

    assertEq(_contract.abstainVotes(), 1);
  }

  function test_VoteAccept() public {
    assertEq(_contract.acceptVotes(), 0);

    _contract.vote(address(1), 1);

    assertEq(_contract.acceptVotes(), 1);
  }

  function test_VoteReject() public {
    assertEq(_contract.rejectVotes(), 0);

    _contract.vote(address(1), 2);

    assertEq(_contract.rejectVotes(), 1);
  }

  function test_AlreadyVoted() public {
    _contract.vote(address(1), 0);

    assertEq(_contract.abstainVotes(), 1);

    vm.expectRevert('ALREADY_VOTED');

    // attempt to vote again
    _contract.vote(address(1), 1);
  }

  function test_VoteChoiceOutOfBounds() public {
    vm.expectRevert('CHOICE_OUT_OF_BOUNDS');

    _contract.vote(address(1), 10);
  }
}
