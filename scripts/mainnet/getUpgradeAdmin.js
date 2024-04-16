const { ethers, upgrades } = require("hardhat");

async function main() {
  const signer = await ethers.provider.getSigner();
  const existingProxyAddress = "...";

  console.log("Retrieving upgrade owner...");
  const upgradeOwner = await upgrades.erc1967.getAdminAddress(existingProxyAddress);
  console.log("Upgrade owner of the proxy is:", upgradeOwner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
