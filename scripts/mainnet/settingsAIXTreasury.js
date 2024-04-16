const { ethers } = require("hardhat");

async function main() {
  const treasuryProxyAddress = process.env.ETH_TREASURY_ADDRESS;
  const liquidityAddAddress = process.env.ETH_LIQUIDITY_ADD_ADDRESS;
  const teamWallet = process.env.ETH_TEAM_WALLET;
  // const ownerWallet = '0x900a177e76db8409663885b9f05AF58603BeD4c6';
  const aixSeller = '...';

  const aixReceivers = [
    // { share: 10000, receiver: aixSeller, doCallback: false},
  ];

  const ethReceivers = [
    // { share: 500, receiver: liquidityAddAddress, doCallback: false},
    { share: 10000, receiver: teamWallet, doCallback: false},
  ];


  const AIXTreasury = await ethers.getContractAt("AIXTreasury", treasuryProxyAddress);

  const args = [
    aixReceivers,
    ethReceivers
  ];

  const tx = await AIXTreasury.setReceivers(...args);

  await tx.wait();

  console.log("Transaction ID:", tx.hash);
  console.log("setReceivers with args:", args);

  // Wait for 100 seconds
  console.log("Waiting for 100 seconds...");
  await new Promise(resolve => setTimeout(resolve, 100000));

  // Read and log receivers
  await logReceivers(AIXTreasury, 'aixReceivers');
  await logReceivers(AIXTreasury, 'ethReceivers');
}


async function logReceivers(contract, receiverType) {
    console.log(`Reading ${receiverType}...`);
    for (let i = 0; i < 10; i++) {
        try {
            const receiver = await contract[receiverType](i);
            console.log(`${receiverType} [${i}]:`, receiver);
        } catch (error) {
            console.log(`${receiverType} [${i}]: No more elements`);
            break;
        }
    }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
