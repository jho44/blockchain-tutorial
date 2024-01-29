// testing with mocha

const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
  let simpleStorageFactory, simpleStorage;
  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  });

  it("Should start with a favorite number of 0", async function () {
    const currVal = await simpleStorage.retrieve();
    const expectedVal = "0";
    // can then use either `assert` or `expect` from chai
    assert.equal(currVal.toString(), expectedVal);
    // expect(currVal.toString()).to.equal(expectedVal) -- patrick prefers just using assert as much as poss tho
  });

  it("Should update when we call store", async function () {
    const expectedVal = "7";
    const txRes = await simpleStorage.store(expectedVal);
    await txRes.wait(1);

    const currVal = await simpleStorage.retrieve();
    assert.equal(currVal.toString(), expectedVal);
  });
});
