// lil script that'll let us fund our contracts very easily in the localhost node -- for any reason
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing...");
  const txRes = await fundMe.withdraw();
  await txRes.wait(1);
  console.log("Got it back!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
