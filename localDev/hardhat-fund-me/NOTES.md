## Linting

- lint solidity code with solhint and bash cmd that looks like `yarn solhint contracts/*.sol`

## Deploy

- rather than deploying with script, do so with hardhat-deploy

  - want to save deployment to file and make deployment and tests jive better together
  - will needa create a `deploy` folder at root dir (i.e. in the hypothetical `hardhat-fund-me` dir), which is where hardhat-deploy will look when we run `yarn hardhat deploy`
    - number all of the scripts you stick in there with the order you want them to run in; e.g. `01-deploy-fund-me.js`
  - need to install ethers like so so that we use hardhat-deploy's ethers rather than hardhat's ethers `yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers`
    - ethers will now rmb all of our deployments

- can deploy only subset of deploy scripts by doing sth like

  ```bash
  yarn hardhat deploy --tags mocks
  ```

  - this'll run just the scripts with `mocks` amongst their tags

- after deploying with `hardhat-deploy`, you'll be able to readily access your deployments in `yarn hardhat node` env

## Named Accounts

- can be hard to differentiate b/t accs in `hardhat.config.js` by just their private keys
  ```json
  rinkeby: {
    url: process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example",
    accounts: [process.env.PRIVATE_KEY || "0xkey"],
    chainId: 4,
  }
  ```
  - so can add `namedAccounts` section to `hardhat.config.js`

## Parametrize Price Feed Address

this is what we wrote in PriceConverter when we were still in remix

```
AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
```

but now we wanna enable deploying to other chains -- don't want this hardcoded address here

so have FundMe take in `address priceFeedAddress` in its constructor

```solidity
// FundMe.sol
AggregatorV3Interface public priceFeed;

constructor(address priceFeedAddress) {
  owner = msg.sender;
  priceFeed = AggregatorV3Interface(priceFeedAddress)
}

function fund() public payable {
  require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, ...)
  ...
}
```

```solidity
// PriceConverter.sol
function getConversionRate(uint256 ethAmt, AggregatorV3Interface priceFeed) internal view returns (uint256) {
  uint256 ethPrice = getPrice(priceFeed);
  ...
}

function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
  // delete hardcoded priceFeed from here
  ...
}
```

## Testing

- unit test -- test minimal portions of your code locally
  - done with local hardhat network or forked hardhat network
- staging / integration test -- done on testnet (last stop)

## Logging

- import `hardhat/console.sol`

## Storage

- class properties are stored in "Storage" -- persistent memory assoc w/ contract

  - each storage slot is 32 bytes long
  - exceptions are const and immutable vars -- those are stored in contract's bytecode rather than Storage

- even if var is `private`, you can still access its val -- you can read anything on the blockchain

- reading from / writing to Storage uses a lot of gas

  - calculated from opcodes (can be found in buildinfo artifact)
  - opcodes for Storage access are SLOAD and SSTORE
  - so should prepend all storage vars with `s_` e.g. `s_addressToAmountFunded`
    - prepend immutable vars with `i_`
    - makes it easy to see which lines will then be expensive
    - don't forget to update vars in test too

- private and internal vars are also cheaper than public
  - and anyone can still read them since they're on the blockchain
  - so change the relevant vars' visibility to private and create getters for them
    - this way, others also don't needa worry about `s_` -- they have a nicer API in the form of these getters
    - don't forget to refactor test too

## package.json

```json
scripts: {
  "test": "yarn hardhat test",
  "test:staging": "yarn hardhat test --network rinkeby",
  "lint": "yarn solhint 'contracts/*.sol'",
  "lint:fix": "yarn solhint 'contracts/*.sol' --fix",
  "format": "yarn prettier --write .",
  "coverage": "yarn hardhat coverage"
}
```

NOTE: we don't use eslint so can just delete those from your proj if you started with one of the hardhat starters
