const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { devChains } = require("../../helper-hardhat-config");

!devChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe, deployer, mockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1"); // "1000000000000000000" aka 1 eth
      beforeEach(async function () {
        // deploy FundMe contract w/ hardhat-deploy

        deployer = (await getNamedAccounts()).deployer;
        /*
        another way you could get acc from hardhat config is by accessing 
        network's `accounts` field like so

        const accounts = await ethers.getSigners();
        const accountZero = accounts[0];
        */

        // deployments.fixture lets you run your deploy folder with as many tags as you like
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer); // gets most recent deployment of FundMe contract
        // connecting deployer to fundMe acc
        // so whenever you call func w/ fundMe, it'll be from deployer
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("constructor", function () {
        it("sets the aggregator addresses properly", async function () {
          const res = await fundMe.priceFeed();
          assert.equal(res, mockV3Aggregator.address);
        });
      });

      // note: skipping tests for receive and fallback funcs in the lesson

      describe("fund", function () {
        it("fails if you don't send enough ETH", async function () {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
          // chai is overwritten by hardhat-waffle's chai
        });

        it("updated the amt funded data structure", async function () {
          await fundMe.fund({ value: sendValue });
          const res = await fundMe.addressToAmountFunded(deployer);
          assert.equal(res.toString(), sendValue.toString());
        });

        it("adds funder to array of funders", async function () {
          await fundMe.fund({ value: sendValue });
          const funder = await funder.funders(0);
          assert.equal(funder, deployer);
        });
      });

      describe("withdraw", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendValue });
        });

        it("withdraw ETH from a single funder", async function () {
          // way to think about testing: first ARRANGE the test, then ACT, then run the ASSERT
          // arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // act
          const txRes = await fundMe.withdraw();
          const txReceipt = await txRes.wait(1);
          // after this point, FundMe balance should be in deployer's balance
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
          // using .add since balance is BigNumber
          // https://youtu.be/gyMwXuJrbJQ?t=41582 has an example of how to use breakpoints in vscode to get gasCost
        });

        it("allows us to withdraw with multiple funders", async function () {
          // arrange
          const accs = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accs[i]);
            // connect to sth other than `deployer` so that these other accs can iteract w/ contract
            await fundMeConnectedContract.fund({ value: sendValue });
          }

          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // act
          const txRes = await fundMe.withdraw();
          const txReceipt = await txRes.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );

          // ensure funders reset properly
          await expect(fundMe.funders(0)).to.be.reverted;

          for (let i = 1; i < 6; i++) {
            assert.equal(await fundMe.addressToAmountFunded(accs[i].address));
          }
        });

        it("only allows the owner to withdraw", async function () {
          const accs = await ethers.getSigners();
          const attacker = accs[1];
          const attackerConnectedContract = await fundMe.connect(attacker);
          await expect(attackerConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });
      });
    });
