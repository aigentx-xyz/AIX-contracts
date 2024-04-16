const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const signer = await hre.ethers.provider.getSigner();
  if (signer.address.toLowerCase() !== '0x0e4D95Fa730c320500872081bD8C5715C40aA38E'.toLowerCase()) {
    throw new Error('signer is not correct');
  }

  const AIX = await hre.ethers.getContractFactory("AIX");
  const aixArgs = [
    process.env.TREASURY_PUBLIC_KEY,
    450,
    450
  ];
  const aix = await AIX.deploy(...aixArgs);
  await aix.waitForDeployment();
  console.log('aix:', aix);
  console.log("AIX deployed to:", aix.target);

  console.log("wait before verify");
  await sleep(30 * 1000);
  console.log("verify");

  await hre.run("verify:verify", {
    address: aix.target,
    constructorArguments: aixArgs,
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
