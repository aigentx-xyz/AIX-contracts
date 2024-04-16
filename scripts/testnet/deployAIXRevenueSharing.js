const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const signer = await hre.ethers.provider.getSigner();
  const AIXRevenueSharing = await hre.ethers.getContractFactory("AIXRevenueSharing");
  const args = [
    '0x58D1C150E88898934C5D347e97744a47B5A67013',  // aix
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',  // router
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',  // weth
    hre.ethers.parseEther('2'),  // maxETHPerDay
  ];
  const revSharing = await AIXRevenueSharing.deploy(...args);
  await revSharing.waitForDeployment();
  console.log("AIXRevenueSharing deployed to:", revSharing.target);

  let tx, receipt;

  tx = await revSharing.setStakePeriodBoosts([
    [100, 10000],
    [150, 15000],
    [200, 30000],
  ])
  receipt = await tx.wait()

  console.log("wait before verify");
  await sleep(30 * 1000);
  console.log("verify");

  await hre.run("verify:verify", {
    address: revSharing.target,
    constructorArguments: args,
  });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
