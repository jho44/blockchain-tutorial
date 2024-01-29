require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("./tasks/block-number");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat", // -- comes with rpc url and PK -- local to our machine
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL || "https://eth-rinkbey/example",
      accounts: [process.env.PRIVATE_KEY || "0xkey"],
      chainId: 4,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337, // same id as hardhat network but not the hardhat network >_>
      // accounts automatically provided by hardhat
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "key", // obtained from creating etherscan acc
  },
  gasReporter: {
    enabled: false, // will show how much gas used at the end of each test
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY || "key", // get api key from coinmarketcap.com -- this is how we'll get usd val
  },
  solidity: "0.8.22",
};
