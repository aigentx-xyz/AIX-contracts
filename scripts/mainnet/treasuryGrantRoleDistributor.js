const { ethers } = require("hardhat");

async function main() {
  const treasuryProxyAddress = process.env.ETH_TREASURY_ADDRESS;
  const distributorAddress = process.env.ETH_DISTRIBUTOR_ADDRESS;
  const AIXTreasury = await ethers.getContractAt("AIXTreasury", treasuryProxyAddress);
  const args = [
      '0xfbd454f36a7e1a388bd6fc3ab10d434aa4578f811acbbcf33afb1c697486313c',
      distributorAddress
  ]
  const tx = await AIXTreasury.grantRole(
      ...args
  );
  await tx.wait();
  console.log("grantRole with args:", args);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
