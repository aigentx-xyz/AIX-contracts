const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const signer = await ethers.provider.getSigner();
    console.log("Signer:", signer.address);

    const existingProxyAddress = "0x21071e52Cd21F1411eC1E5a372239aCECa76891F";

    // Deploy the new AIXPayments implementation
    console.log("Deploying the new AIXPayments implementation...");
    const AIXPayments = await ethers.getContractFactory("AIXPayments");
    // const aixPaymentsNewImpl = await AIXPayments.attach('0x94a0279C4163d2978F830d2646B82c52Cc3A6c3B');
    const aixPaymentsNewImpl = await AIXPayments.deploy();
    await aixPaymentsNewImpl.waitForDeployment();
    console.log("New AIXPayments implementation deployed to:", aixPaymentsNewImpl.target);

    // Wait for a while before verification
    console.log("Waiting before verification...");
    await sleep(100 * 1000);  // Adjust the sleep duration as necessary

    // Verify the new implementation
    console.log("Verifying the new implementation...");
    await hre.run("verify:verify", {
        address: aixPaymentsNewImpl.target,
        constructorArguments: [],
    });

    // Read the proxy admin address directly from the EIP-1967 admin slot
    const adminSlot = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';
    const actualProxyAdminAddress = await ethers.provider.send(
        "eth_getStorageAt", [existingProxyAddress, adminSlot, "latest"]);
    console.log("Directly Read Proxy Admin Address:", actualProxyAdminAddress);

    // Get the proxyAdmin contract instance
    const proxyAdminContract = await upgrades.admin.getInstance();
    console.log("Proxy Admin Contract:", proxyAdminContract.target);

    // Get the owner of the proxyAdmin contract
    const proxyAdminContractOwner = await proxyAdminContract.owner();
    console.log("Proxy Admin Contract Owner:", proxyAdminContractOwner);

    // // Check if the signer is the owner of the proxyAdmin
    // if (signer.address.toLowerCase() !== actualProxyAdminAddress.toLowerCase()) {
    //     throw new Error("Signer is not the owner of the Proxy Admin");
    // }

    const tx = await proxyAdminContract.upgrade(existingProxyAddress, aixPaymentsNewImpl.target);
    console.log("Proxy admin changed implementation to: ", aixPaymentsNewImpl.target);
    console.log("Transaction hash: ", tx.hash);
    await tx.wait();
    console.log("Upgrade complete");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
