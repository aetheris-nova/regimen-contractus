// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.20;

import { Test } from 'forge-std/Test.sol';

// contracts
import { Proposal } from '../../src/contracts/Proposal.sol';

contract ProposalTest is Test {
  Proposal public _contract;
  address _token;
  uint256 _tokenID;

  function setUp() public {
    _contract = new Proposal(
      address(1),
      'Decree: Founding Of The Ordo Administratorum',
      uint48(block.timestamp),
      84000
    );
    _token = address(2);
    _tokenID = uint256(4);
  }

  function test_AlreadyCanceled() public {
    _contract.execute();

    vm.expectRevert('PROPOSAL_ALREADY_EXECUTED');

    _contract.cancel();
  }

  function test_AlreadyExecuted() public {
    _contract.cancel();

    vm.expectRevert('PROPOSAL_ALREADY_CANCELED');

    _contract.execute();
  }

  function test_Cancel() public {
    (bool canceled, , , , , ) = _contract.details();

    assertFalse(canceled);

    _contract.cancel();

    (bool newCanceled, , , , , ) = _contract.details();

    assertTrue(newCanceled);
  }

  function test_Execute() public {
    (, , bool executed, , , ) = _contract.details();

    assertFalse(executed);

    _contract.execute();

    (, , bool newExecuted, , , ) = _contract.details();

    assertTrue(newExecuted);
  }

  function test_VoteAbstain() public {
    assertEq(_contract.abstainVotes(), 0);

    _contract.vote(_token, _tokenID, 0);

    assertEq(_contract.abstainVotes(), 1);
  }

  function test_VoteAccept() public {
    assertEq(_contract.acceptVotes(), 0);

    _contract.vote(_token, _tokenID, 1);

    assertEq(_contract.acceptVotes(), 1);
  }

  function test_VoteReject() public {
    assertEq(_contract.rejectVotes(), 0);

    _contract.vote(_token, _tokenID, 2);

    assertEq(_contract.rejectVotes(), 1);
  }

  function test_AlreadyVoted() public {
    _contract.vote(_token, _tokenID, 0);

    assertEq(_contract.abstainVotes(), 1);

    vm.expectRevert('ALREADY_VOTED');

    // attempt to vote again
    _contract.vote(_token, _tokenID, 1);
  }

  function test_VoteAlreadyCanceled() public {
    _contract.cancel();

    vm.expectRevert('PROPOSAL_ALREADY_CANCELED');

    _contract.vote(_token, _tokenID, 0);
  }

  function test_VoteAlreadyExecuted() public {
    _contract.execute();

    vm.expectRevert('PROPOSAL_ALREADY_EXECUTED');

    _contract.vote(_token, _tokenID, 0);
  }

  function test_VoteChoiceOutOfBounds() public {
    vm.expectRevert('CHOICE_OUT_OF_BOUNDS');

    _contract.vote(_token, _tokenID, 10);
  }
}
