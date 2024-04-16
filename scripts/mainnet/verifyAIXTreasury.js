const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");
const os = require("os");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const aixTreasury = await ethers.getContractAt("AIXTreasury", process.env.ETH_TREASURY_IMPL_ADDRESS);
  await hre.run("verify:verify", {
    address: aixTreasury.target,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
