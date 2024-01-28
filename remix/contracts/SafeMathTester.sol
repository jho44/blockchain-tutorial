// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

/*
SafeMath was used all the time in contracts with solidity older than v0.8
there was an issue in contracts with old solidity
where if you have the biggest num in a type (e.g. 255 for a var with type uint8)
and then you add 1 to it, it mods back down to 0
this phenomenon was bc "unsigned ints were unchecked"
SafeMath checked whether this wraparound would occur in a transaction
- so it'll fail the transaction
*/

contract SafeMathTester {
    uint8 public bigNumber = 255;

    function add() public {
        bigNumber = bigNumber + 1;
        // if you're using solidity ^v0.8 and still want it to be unchecked
        // if you do so like:
        // unchecked { bigNumber = bigNumber + 1; }
        // would want to mark as unchecked to be more gas-efficient
        // ofc, only use if you're absolutely sure that your val won't over or underflow
    }
}