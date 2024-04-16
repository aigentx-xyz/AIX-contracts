const { ethers } = require("hardhat");

async function main() {
  const treasuryProxyAddress = "0xcA7D89CF3D1eF5CE56c4c88cAD81F858e55DB414";
  const liquidityAddAddress = "0x4a8Df1F9737Ef876438f6858A08b29a04035Bfc2";
  const revSharingAddress = "0x453391350e292c55F43C0BD7C5995E2aE5Adb838";
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
    aixReceivers,
    ethReceivers
  ];

  const tx = await AIXTreasury.setReceivers(...args);

  await tx.wait();

  console.log("setReceivers with args:", args);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
