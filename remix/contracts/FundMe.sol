// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

// as of v0.8.4, can define custom errors
// this way, you can save gas by not defining your err msg (arr of chars)
// so no more of this: require(msg.sender == i_owner, "Sender is not i_owner!");
// leaving some requires in here tho so you can see the diff -- in actuality, should use custom errs everywhere
error NotOwner();


import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    // NOTE about saving gas w/ constant and immutable:
    // it's bc they're stored directly in bytecode of contract rather than in storage slot

    uint256 public constant MINIMUM_USD = 50 * 1e18; // tack on 18 0's bc getConversionRate has 18 0's tacked onto it >_> <_< >_>
    // only set once by compilation time -- `constant` keyword applies here
    // saves gas
    // Note: can get gas price from etherscan.io/gastracker

    address[] public funders;
    mapping(address => uint256) public addressToAmtFunded;

    address public immutable i_owner; // only person who can withdraw $$
    // `immutable` keyword applied when you only set it once but after compilation time
    // convention is to prefix all immutable var names with i_
    // saves gas

    constructor() {
        // called immediately after contract deployed
        i_owner = msg.sender; // whoever deploys contract
    }

    function fund() public payable {
        // set min fund amt in USD
        // how send ETH to this contract? need to first mark func as "payable"
        // smart contracts can hold funds just like how wallets can (just think about how deployed contracts have addresses too)
        // msg.value -- global keyword -- how much someone is sending
        // require(msg.value >= 1e18, "Didn't send enough"); // 1e18 = 1 * 10 ** 18 = 1ETH (1e18 WEI) -- money math done in wei
        // if didn't send enough, it won't simply throw an error, it'll "revert"
        // i.e. undo any action done before the reversion and send remaining gas back
        // require(getConversionRate(msg.value) >= MINIMUM_USD, "Didn't send enough"); // 1e18 = 1 * 10 ** 18 = 1ETH (1e18 WEI) -- money math done in wei
        // you'd call it the way we did above if we didn't put getConversionRate into a library
        require(msg.value.getConversionRate() >= MINIMUM_USD, "Didn't send enough");
        // Note: msg.value is the first arg of getConversionRate
        // if want another param in getConversionRate, you'd pass the corresponding arg like
        // msg.value.getConversionRate(secondArg)
        funders.push(msg.sender); // msg.sender is address sending you some $$
        addressToAmtFunded[msg.sender] = msg.value;
    }

    function getVal(uint256 weiAmt) public view returns (uint256) {
        return weiAmt.getConversionRate();
        // 3686642218
    }

    function withdraw() public onlyi_owner {
        // reset all funder amts to 0
        for (uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            addressToAmtFunded[funder] = 0;
        }

        // reset the arr
        funders = new address[](0); // new address arr with 0 objs to start

        // actually withdraw funds
        // 3 ways to send native blockchain currencies
        // 1. transfer -- will error and revert if gas used exceeds the cap (2300)
        // 2. send -- won't error if gas used exceeds the cap (2300) -- will return bool of whether it succeeded
        // 3. call -- no cap on gas
        // more on this in solidity-by-example.org/sending-ether/
        
        // // transfer
        // // msg.sender : address
        // // payable(msg.sender) : payable address
        // // this = this whole contract
        // payable(msg.sender).transfer(address(this).balance);

        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");

        // call -- low lvl func -- can be used to call any func in ethereum w/o even the ABI
        // arg: takes any info about func you wanna call in some other contract
        // if you don't wanna call another func, then just put empty str in it
        // returns 2 things -- (bool callSuccess, bytes memory dataReturned)
        // dataReturned is an arr so needs to be stored in memory
        (bool callSuccess,) = payable(msg.sender).call{ value: address(this).balance }("");
        require(callSuccess, "Call failed");
    }

    // this enables us to conveniently add this check to any other func which deps on you being the i_owner
    modifier onlyi_owner {
        // require(msg.sender == i_owner, "Sender is not i_owner!");
        if (msg.sender != i_owner) {
            revert NotOwner();
        }
        _; // "do the rest of the code"
    }

    receive() external payable {
        // takes more gas to go this route than to just call the fund func
        fund();
    }

    fallback() external payable {
        fund();
    }
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

/*
what happens if someone sends this contract ETH w/o calling the `fund` func?
by default, our `fund` func wouldn't be automatically triggered so we'd miss recording those ppl who funded $$
however, solidity has `receive` and `fallback` funcs

*/