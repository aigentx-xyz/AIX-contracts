const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const signer = await hre.ethers.provider.getSigner();

  if (signer.address.toLowerCase() != '0x9999fE118ce6d0AE9fD2B917aDE1a8C03769525b'.toLowerCase()) {
    console.log("signer address is not empty");
    return;
  }

  const AIXRevenueSharing = await hre.ethers.getContractFactory("AIXRevenueSharing");
  const args = [
    '0x40e9187078032afe1a30cfcf76e4fe3d7ab5c6c5',  // aix
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',  // router
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',  // weth
    hre.ethers.parseEther('2'),  // maxETHPerDay
  ];
  const revSharing = await AIXRevenueSharing.deploy(...args);
  await revSharing.waitForDeployment();
  console.log("AIXRevenueSharing deployed to:", revSharing.target);

  let tx, receipt;

  tx = await revSharing.setStakePeriodBoosts([
    [30*24*3600,  10000],
    [60*24*3600,  40000],
    [90*24*3600, 120000],
  ])
  console.log("setStakePeriodBoosts tx:", tx.hash);
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
