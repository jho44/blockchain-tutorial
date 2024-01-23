// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; // from npm package

contract FundMe {
    uint256 public minimumUsd = 50; // tack on 18 0's bc getConversionRate has 18 0's tacked onto it >_> <_< >_>

    address[] public funders;

    function fund() public payable {
        // set min fund amt in USD
        // how send ETH to this contract? need to first mark func as "payable"
        // smart contracts can hold funds just like how wallets can (just think about how deployed contracts have addresses too)
        // msg.value -- global keyword -- how much someone is sending
        // require(msg.value >= 1e18, "Didn't send enough"); // 1e18 = 1 * 10 ** 18 = 1ETH (1e18 WEI) -- money math done in wei
        // if didn't send enough, it won't simply throw an error, it'll "revert"
        // i.e. undo any action done before the reversion and send remaining gas back
        require(getConversionRate(msg.value) >= minimumUsd, "Didn't send enough"); // 1e18 = 1 * 10 ** 18 = 1ETH (1e18 WEI) -- money math done in wei
    }

    function getPrice() public view returns(uint256) {
        // when interacting w/ sth outside the contract, need:
        // 1. ABI of the contract
        // 2. Address of the external contract -- from docs.chain.link/docs/ethereum-addresses/
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (, int256 answer,,,) = priceFeed.latestRoundData();
        // ETH in terms of USD
        // 2345.68413000
        return uint256(answer);
    }

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        return priceFeed.version();
    }

    function getConversionRate(uint256 weiAmt) public view returns (uint256) {
        uint256 usdPerEth = getPrice(); // usd / eth
        uint256 ethAmtInUsd = (usdPerEth * weiAmt) / 1e18;
        return ethAmtInUsd;
    }

    function getVal(uint256 weiAmt) public view returns (uint256) {
        return getConversionRate(weiAmt);
    }

    // function withdraw() {
    // }
}

/*
blockchains are deterministic systems
smart contract connectivity problem (aka the oracle problem):
they can't interact w/ real world data (e.g. what's the val of 1ETH, what are random nums, who's the president, etc
can't do external computation
- e.g. even if you have fantastic AI model you'd like to integrate w/ contract, contract by itself can't do anything with that AI model
blockchains needa be deterministic so multiple nodes can reach consensus

soln: blockchain oracle
- any device that interacts w/ off-chain world to provide external data / computation to smart contracts
don't want centralized oracles (reintroduce problem of single point of failure)

soln: chainlink
- decentralized oracle network to bring outside data / computation to smart contracts
- give rise to hybrid smart contracts

exchanges and data providers pass their data through bunch of chainlink nodes
"medium" aggregates data from chainlink nodes (aka node operators) and delivers to "reference contract"
other smart contracts can then use the val delivered by "medium" to "reference contract"
updated periodically

whenever node operator delivers data to smart contract, they get a lil money in terms of chainlink tokens

good docs can be found here: docs.chain.link
to learn addresses for diff price feeds and how to get a random number in your contract

to request data from chainlink node, need to pay some LINK token
to pay LINK token, you must have some LINK token in the contract querying that's querying the chainlink node
*/