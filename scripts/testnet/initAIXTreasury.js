const { ethers } = require("hardhat");

async function main() {
  const treasuryProxyAddress = "0xcA7D89CF3D1eF5CE56c4c88cAD81F858e55DB414";
  const aixTokenAddress = "0x32b94329750C03Aa0bE627451090856262D89501";
  const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

  const liquidityAddAddress = "0x4a8Df1F9737Ef876438f6858A08b29a04035Bfc2";
  const revSharingAddress = "0xf256B71e5c5B70EDA6c4504959cA79636C4367e8";
  const teamWallet = '0x355B68143BE3a47caccbd144182B1c18a90A666a';

  const aixReceivers = [
    { share: 1000, receiver: teamWallet, doCallback: false},
    { share: 1000, receiver: liquidityAddAddress, doCallback: false},
  ];

  const ethReceivers = [
    { share: 1000, receiver: teamWallet, doCallback: false},
    { share: 1000, receiver: liquidityAddAddress, doCallback: false},
    { share: 6000, receiver: revSharingAddress, doCallback: false},
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
