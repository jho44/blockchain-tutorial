// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage {
    // 2 keywords to override inherited class method
    // virtual + override
    // in order for overridable func to be overridden, need to specify that it's "virtual" in the parent class
    function store(uint256 _favoriteNumber) public override {
        favoriteNumber = _favoriteNumber;
        // the more stuff you do in your func, the more gas it costs to call
    }
}