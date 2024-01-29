// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// // will compile your contracts, add the Hardhat Runtime Environment's members to the
// // global scope, and execute the script.
// const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.parseEther("0.001");

//   const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
//     value: lockedAmount,
//   });

//   await lock.waitForDeployment();

//   console.log(
//     `Lock with ${ethers.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
// run any task in hardhat with the `run` package
// get network config info with `network`
const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  console.log(simpleStorage);
  console.log(`Deployed contract to: ${simpleStorage.target}`);

  // only need to verify contract if it's being deployed to live network -- determine via chainId
  // AND have etherscan api key
  if (network.config.chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    // etherscan might not immediately be aware that tx exists so wait for a few blocks to be mined first before verifying
    console.log("Waiting for block txes...");
    await simpleStorage.deploymentTransaction().wait(6);
    await verify(simpleStorage.address, []);
  }

  const currVal = await simpleStorage.retrieve();
  console.log(`Current Value is: ${currVal}`);

  const txRes = await simpleStorage.store(7);
  await txRes.wait(1);
  const updatedVal = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedVal}`);
}

/*
for verifying your contract's code (i.e. assure users and developers that the published contract code is the same code running at the contract address on the Ethereum blockchain.)
to do so manually, you'd paste all your code and i guess under the hood, it compiles it to check whether the bytecode matches b/t your published and your pasted code
now, let's do so programmatically
and you wanna verify your contract's code so that ppl know it is secure and transparent

SimpleStorage doesn't have a constructor so `args` is empty
this func will work on block explorers like etherscan but not all block explorers (will need to check their apis to find out how to verify contract programmatically)

won't be hitting etherscan's API ourselves w/ axios/fetch tho
will use hardhat plugin
*/
async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

main().then(() =>
  process.exit(0).catch((err) => {
    console.error(err);
    process.exit(1);
  })
);
