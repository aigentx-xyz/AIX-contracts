const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
const os = require("os");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const gasPrice = undefined;
  const signer = await ethers.provider.getSigner();

  const AIXTreasury = await ethers.getContractFactory("AIXTreasury");
  console.log("Deploying AIXTreasury implementation...");

  const newAixTreasuryImpl = await AIXTreasury.deploy({
    gasPrice: gasPrice
  });

  console.log("NewAIXTreasuryUpgradeable implementation deployed at:", newAixTreasuryImpl);

  console.log("wait before verify");
  await sleep(200 * 1000);
  console.log("verify");

  await hre.run("verify:verify", {
    address: newAixTreasuryImpl.target,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
