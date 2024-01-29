// get curr block num of whatever blockchain we're working with

const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
  async (taskArgs, hre) => {
    // hre is "hardhat runtime env" -- basically can access whatever things that require('hardhat') can
    const blockNum = await hre.ethers.provider.getBlockNumber();
    console.log(`Current block number: ${blockNum}`);
  }
);

module.exports = {};
