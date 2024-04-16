const { ethers, upgrades } = require("hardhat");
const hre = require("hardhat");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const signer = await ethers.provider.getSigner();
    console.log("Signer:", signer.address);

    const initialBalance = await ethers.provider.getBalance(signer.address);
    console.log("Initial balance:", ethers.formatEther(initialBalance), "ETH");

    const AIXPayments = await ethers.getContractFactory("AIXPayments");
    const deployedAddress = '0x21071e52Cd21F1411eC1E5a372239aCECa76891F';
    const aixPayments = AIXPayments.attach(deployedAddress);
    console.log("AIXPayments on:", aixPayments.target);

    const shares = [
        1000,
        500,
        250,
    ]

    const tx = await aixPayments.setReferralShares(
        shares
    );
    console.log(`setReferralShares tx: ${tx.hash}, shares: ${shares}`);
    await tx.wait();
    console.log("setReferralShares complete");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
