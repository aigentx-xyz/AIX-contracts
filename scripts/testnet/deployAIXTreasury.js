const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const gasPrice = ethers.parseUnits('20', 'gwei');
  // const gasPrice = undefined;
  console.log("Log Level:", process.env.HARDHAT_NETWORK_LOG_LEVEL);

  const signer = await hre.ethers.provider.getSigner();

  const initialBalance = await ethers.provider.getBalance(signer.address);
  console.log("Initial balance:", ethers.formatEther(initialBalance), "ETH");

  console.log("deploy AIXTreasuryUpgradeable implementation");
  const AIXTreasuryUpgradeable = await ethers.getContractFactory("AIXTreasury");
  const aixTreasuryImpl = await AIXTreasuryUpgradeable.deploy({
    gasPrice: gasPrice,
    timeout: 0,
  });
  await aixTreasuryImpl.waitForDeployment(); // Wait for the deployment transaction to be mined
  console.log("AIXTreasuryUpgradeable implementation deployed to:", aixTreasuryImpl.target);

  console.log("wait before verify");
  await sleep(30 * 1000);
  console.log("verify");

  await hre.run("verify:verify", {
    address: aixTreasuryImpl.target,
    constructorArguments: [],
  });

  console.log("deploy proxy");
  const aixTreasuryUpgradeable = await upgrades.deployProxy(AIXTreasuryUpgradeable, [], {
    initializer: false,
    implementationAddress: aixTreasuryImpl.target,
    timeout: 0,
    gasPrice: gasPrice,
  });

  await aixTreasuryUpgradeable.waitForDeployment();

  console.log("AIXTreasuryUpgradeable deployed to:", aixTreasuryUpgradeable.target);

  const admin = await upgrades.admin.getInstance();
  console.log("ProxyAdmin deployed to:", admin.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
