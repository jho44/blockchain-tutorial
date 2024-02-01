// function deployFunc() {}

// module.exports.default = deployFunc;
const { networkConfig, devChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

// anon funcs ftw
// it take `hre` as arg and we destructure `getNamedAccounts` and `deployments` from hre
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts(); // must be specified in hardhat.config.js

  let ethUsdPriceFeedAddress;

  if (devChains.includes(network.name)) {
    // if on dev chain (which doesn't have price feed), must've deployed minimal version of price feed for local testing
    // so get most recent deployment
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // now for verifying the contract
  if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args);
  }
  log("------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
