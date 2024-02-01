// deploy our own price feed contract for chains which don't have price feeds
// like localhost and hardhat

const { network } = require("hardhat");
const {
  devChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts(); // must be specified in hardhat.config.js

  if (devChains.includes(network.name)) {
    log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER], // args for MockV3Aggregator constructor
    });
    log("Mocks deployed!");
    log("------------------------------------"); // end of this deploy script
  }
};

module.exports.tags = ["all", "mocks"];
