const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // const gasPrice = ethers.parseUnits('20', 'gwei');
  const gasPrice = undefined;
  console.log("Log Level:", process.env.HARDHAT_NETWORK_LOG_LEVEL);

  // Getting the ProxyAdmin instance
  const proxyAdminInstance = await upgrades.admin.getInstance();
  console.log("ProxyAdmin deployed to:", proxyAdminInstance.address);

  // // Creating an interface to interact with ProxyAdmin
  // const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  // const proxyAdminContract = ProxyAdmin.attach(proxyAdminInstance.address);
  // // Getting the owner of the ProxyAdmin
  // const proxyAdminOwner = await proxyAdminContract.owner();
  // console.log("ProxyAdmin Owner:", proxyAdminOwner);

  // // Getting the owner of the ProxyAdmin
  // const proxyAdminContract = await ethers.getContractAt("Ownable", proxyAdminInstance.address);
  // const proxyAdminOwner = await proxyAdminContract.owner();
  // console.log("ProxyAdmin Owner:", proxyAdminOwner);

  // Getting the signer's address
  const signer = await ethers.provider.getSigner();
  console.log("Signer:", signer.address);

  // // Checking if the ProxyAdmin owner matches the signer's address
  // if (proxyAdminOwner !== signer.address) {
  //     console.error("Error: ProxyAdmin owner address does not match signer's address");
  //     process.exit(1); // Exiting the script with an error
  // }

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
  await sleep(150 * 1000);
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
