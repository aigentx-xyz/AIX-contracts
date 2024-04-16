const { ethers } = require("hardhat");

async function main() {
  const treasuryProxyAddress = process.env.ETH_TREASURY_ADDRESS;
  const aixTokenAddress = process.env.ETH_AIX_ADDRESS;
  const uniswapRouterAddress = process.env.ETH_UNISWAP_ROUTER_ADDRESS;
  const wethAddress = process.env.ETH_WETH_ADDRESS;
  const teamWallet = process.env.ETH_TEAM_WALLET;

  const aixReceivers = [
    // { share: 5000, receiver: liquidityAddAddress, doCallback: false},
  ];

  const ethReceivers = [
    { share: 10000, receiver: teamWallet, doCallback: false},
  ];

  const AIXTreasury = await ethers.getContractAt("AIXTreasury", treasuryProxyAddress);

  const args = [
    aixTokenAddress,
    uniswapRouterAddress,
    wethAddress,
    aixReceivers,
    ethReceivers
  ];

  const tx = await AIXTreasury.initialize(...args);

  await tx.wait();

  console.log("Initialized with args:", args);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
