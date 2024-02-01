// lil script that'll let us fund our contracts very easily in the localhost node -- for any reason
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding Contract...");
  const txRes = await fundMe.fund({ value: ethers.utils.parseEther("0.1") });
  console.log("Funded!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
