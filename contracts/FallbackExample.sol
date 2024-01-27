// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract FallbackExample {
    uint256 public result;

    receive() external payable {
        // solidity knows this is a special func so don't needa specify `function`
        // this is called whenever contract receives $$ (even if it's $0)

    }

    fallback() external payable {
        // called when, e.g., you include calldata in low level iteraction
        // doesn't match any of your funcs so solidity will redirect to fallback
    }
}