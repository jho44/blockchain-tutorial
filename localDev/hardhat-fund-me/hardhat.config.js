require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example",
      accounts: [process.env.PRIVATE_KEY || "0xkey"],
      chainId: 4,
      blockConfirmations: 6, // how long you wanna wait before verifying contract
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
  namedAccounts: {
    deployer: {
      default: 0, // by default, 0th acc will be the deployer
      4: 1, // 1st acc is the deployer in the rinkeby network
      31337: 1, // 1st acc is the deployer in the hardhat network
    },
    user: {
      // could also specify a user for tests
      default: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.22",
      },
      {
        version: "0.6.6",
      },
    ],
  },
};
