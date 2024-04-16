const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const subscriptionDetails = {
    "1001": { setupPrice: ethers.parseEther("0.000005"), paymentPeriodPrice: ethers.parseEther("0") },
    "1002": { setupPrice: ethers.parseEther("0.000005"), paymentPeriodPrice: ethers.parseEther("0.000002") },
    "1003": { setupPrice: ethers.parseEther("0.00005"), paymentPeriodPrice: ethers.parseEther("0.00001") }
};

// Ensure the value is a BigNumber
function toBigNumber(value) {
    return BigNumber.isBigNumber(value) ? value : BigNumber.from(value);
}

// Calculate amount to pay for a new subscription
function calculatePayment(subscriptionId, paymentPeriodTimes) {
    const { setupPrice, paymentPeriodPrice } = subscriptionDetails[subscriptionId];
    return toBigNumber(setupPrice).add(toBigNumber(paymentPeriodPrice).mul(paymentPeriodTimes));
}

// Calculate amount to pay for an upgrade
function calculateUpgradePayment(fromId, toId, paymentPeriodTimes, remainingTime) {
    const { setupPrice: toSetupPrice, paymentPeriodPrice: toPaymentPeriodPrice } = subscriptionDetails[toId];
    const { setupPrice: fromSetupPrice, paymentPeriodPrice: fromPaymentPeriodPrice } = subscriptionDetails[fromId];

    const totalAmount = toBigNumber(toSetupPrice).add(toBigNumber(toPaymentPeriodPrice).mul(paymentPeriodTimes));
    const compensation = toBigNumber(fromSetupPrice).add(toBigNumber(fromPaymentPeriodPrice).mul(remainingTime));

    return totalAmount.gt(compensation) ? totalAmount.sub(compensation) : BigNumber.from(0);
}

async function main() {
    const signer = await ethers.provider.getSigner();
    const deployedAddress = '0x21071e52Cd21F1411eC1E5a372239aCECa76891F';
    const AIXPayments = await ethers.getContractFactory("AIXPayments");
    const aixPayments = AIXPayments.attach(deployedAddress);

    // Function to pay for a subscription
    async function payForSubscription(subscriptionId, paymentPeriodTimes, referrals, signatureTimestamp, signature) {
        const amountToPay = calculatePayment(subscriptionId, paymentPeriodTimes);
        const tx = await aixPayments.connect(signer).pay(
            subscriptionId,
            paymentPeriodTimes,
            referrals,
            signatureTimestamp,
            signature,
            { value: amountToPay }
        );
        await tx.wait();
        console.log(`Paid for subscription ${subscriptionId}`);
    }

    // Function to upgrade a subscription
    async function upgradeSubscription(fromId, toId, paymentPeriodTimes, referrals, signatureTimestamp, signature, remainingTime) {
        const amountToPay = calculateUpgradePayment(fromId, toId, paymentPeriodTimes, remainingTime);
        const tx = await aixPayments.connect(signer).upgrade(
            fromId,
            toId,
            paymentPeriodTimes,
            referrals,
            signatureTimestamp,
            signature,
            { value: amountToPay }
        );
        await tx.wait();
        console.log(`Upgraded from ${fromId} to ${toId}`);
    }

    // Pay for the first subscription (ID 1001)
    await payForSubscription(1001, 1, [], Date.now(), "0x"); // Replace "0x" with the actual signature

    // Wait for 30 seconds
    await sleep(30000);

    // Upgrade to subscription 1002
    // Note: You need to calculate the remaining time for the upgrade
    await upgradeSubscription(1001, 1002, 1, [], Date.now(), "0x", remainingTimeFor1001); // Replace "0x" and remainingTimeFor1001 with actual values

    // Wait for 30 seconds
    await sleep(30000);

    // Upgrade to subscription 1003
    // Note: You need to calculate the remaining time for the upgrade
    await upgradeSubscription(1002, 1003, 1, [], Date.now(), "0x", remainingTimeFor1002); // Replace "0x" and remainingTimeFor1002 with actual values
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
