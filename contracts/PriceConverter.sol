// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; // from npm package

// libraries are like contracts except you can't declare any state var and can't send ether

library PriceConverter {
    function getPrice() internal view returns(uint256) {
        // when interacting w/ sth outside the contract, need:
        // 1. ABI of the contract
        // 2. Address of the external contract -- from docs.chain.link/docs/ethereum-addresses/
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (, int256 answer,,,) = priceFeed.latestRoundData();
        // ETH in terms of USD
        // 234568413000
        return uint256(answer * 1e10);
    }

    function getConversionRate(uint256 weiAmt) internal view returns (uint256) {
        uint256 usdPerEth = getPrice(); // usd / eth
        uint256 ethAmtInUsd = (usdPerEth * weiAmt) / 1e18;
        // 3000 * 1e8 * .016666666666667000 * 1e18 / 1e18
        return ethAmtInUsd;
        // 36 * 1e8
    }
}