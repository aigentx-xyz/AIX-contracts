const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const args = [
    '0x40e9187078032afe1a30cfcf76e4fe3d7ab5c6c5',  // aix
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',  // router
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',  // weth
    hre.ethers.parseEther('2'),  // maxETHPerDay
  ];
  const revSharing = await hre.ethers.getContractAt(
      "AIXRevenueSharing",
    '0xd051eF3DBBEA636Fa009A0318ac51e9eE2CBc3bD'
  );
  console.log("AIXRevenueSharing deployed to:", revSharing.target);
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
