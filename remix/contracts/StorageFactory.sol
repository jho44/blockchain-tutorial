// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./SimpleStorage.sol"; // import keyword takes path / package / github

contract StorageFactory {
    // SimpleStorage public simpleStorage;
    SimpleStorage[] public simpleStorageArray; // keep track of all SimpleStorage deployments

    function createSimpleStorageContract() public {
        // deploy SimpleStorage contract and assign to var
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
        // stands for StorageFactory store
        // need 2 things to interact with any contract:
        // 1. address of contract
        // 2. ABI of contract (application binrary interface) -- tell code exactly how it can interact with contract
        // automatically get ABI by importing the contract
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
    }

    function sfGet(uint256 _simpleStorageIndex) public view returns(uint256) {
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}