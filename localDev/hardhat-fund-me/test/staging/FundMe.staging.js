const { getNamedAccounts } = require("hardhat");
const { devChains } = require("../../helper-hardhat-config");

// only run if not on dev chain
devChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe, deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });
