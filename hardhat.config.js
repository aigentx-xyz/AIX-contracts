require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.8",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200 // Optimize for how many times you intend to run the code
      }
    }
  },
  networks: {
    // sepolia: {
    //   url: process.env.SEPOLIA_URL,
    //   accounts: [process.env.PRIVATE_KEY]
    // },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY],
      loggingEnabled: true,
    },
    eth: {
      url: process.env.ETHEREUM_URL,
      accounts: [process.env.ETH_PRIVATE_KEY]
    },
  },
  etherscan: {
    // url: "https://sepolia.etherscan.io/",
    // url: "https://goerli.etherscan.io/",
    url: "https://etherscan.io/",
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
