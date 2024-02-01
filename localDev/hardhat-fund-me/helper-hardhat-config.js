const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0xaddress",
  },
};

const devChains = ["hardhat", "localhost"];

// constructor args for MockV3Aggregator
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
  devChains,
  networkConfig,
  DECIMALS,
  INITIAL_ANSWER,
};
