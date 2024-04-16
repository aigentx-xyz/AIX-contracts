const { ethers, upgrades } = require("hardhat");

async function main() {
  const existingProxyAddress = process.env.ETH_TREASURY_ADDRESS;
  const existingImplementationAddress = process.env.ETH_TREASURY_IMPL_ADDRESS;
  const proxyAdmin = await upgrades.admin.getInstance();
  console.log("Proxy admin deployed to:", proxyAdmin.target);
  const tx = await proxyAdmin.upgrade(existingProxyAddress, existingImplementationAddress);
  console.log("Proxy admin changed implementation to: ", existingImplementationAddress);
  console.log("Transaction hash: ", tx.hash);
  await tx.wait();
  console.log("Upgrade complete");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
