const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");

describe("Woolf", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployWoolf() {
    const WOOLF_NAME = 'woolf';
    const PLANT = 'plant';
    const NOT_FOOD = 'not-food';
    const PLASTIC = 'plastic'
    const MEAT = 'meat'
    const stringComparerLib = await hre.ethers.getContractFactory("StringComparer");
    const stringComparer = await stringComparerLib.deploy();
    await stringComparer.deployed();
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const WoolfContract = await hre.ethers.getContractFactory("Woolf",  { libraries: {StringComparer: stringComparer.address}});
    const woolf = await WoolfContract.deploy(WOOLF_NAME);
    const farmerContract = await hre.ethers.getContractFactory("Farmer");
    const farmer = await farmerContract.deploy();

    return { woolf, farmer, owner, otherAccount, WOOLF_NAME, PLANT, NOT_FOOD, PLASTIC, MEAT};
  }

  it('Woolf has the correct name. ', async function () {
    const {woolf, WOOLF_NAME } = await loadFixture(deployWoolf);

    expect(await woolf.getName()).to.equal(WOOLF_NAME);
  });

  it('Woolf can sleep.', async function () {
    const {woolf } = await loadFixture(deployWoolf);

    expect(await woolf.sleep).to.be.a('function');
  });

  it('Woolf can eat “meat”', async function () {
    const MEAT = 'meat'
    const {woolf } = await loadFixture(deployWoolf);

    expect(await woolf.eat(MEAT)).not.to.be.reverted;
  });

  it('Woolf cannot eat ”meat”, ”not-food”, ”plastic”.', async function () {
    const {woolf, NOT_FOOD, PLASTIC, MEAT } = await loadFixture(deployWoolf);

    expect(woolf.eat(NOT_FOOD)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(woolf.eat(PLASTIC)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(woolf.eat(MEAT)).to.be.revertedWith(
        "Can only eat plant food"
    );
  });

  it('Farmer can call Woolf, Woolf responds correctly', async function () {
    const SOUND_OF_WOOLF = 'Awoo'
    const {woolf,farmer } = await loadFixture(deployWoolf);

    expect(farmer.call(woolf.address)).to.be.revertedWith(
        SOUND_OF_WOOLF
    );
  });

  it('Farmer can feed Woolf with plant', async function () {
    const {woolf,farmer, PLANT } = await loadFixture(deployWoolf);

    expect(farmer.feed(woolf.address, PLANT)).not.to.be.reverted;
  });

  it('Farmer cannot feed Woolf with ”not-food”, ”plastic” and anything else', async function () {
    const {woolf,farmer, NOT_FOOD, PLASTIC, MEAT } = await loadFixture(deployWoolf);

    expect(farmer.feed(woolf.address, NOT_FOOD)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(farmer.feed(woolf.address, PLASTIC)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(farmer.feed(woolf.address, MEAT)).to.be.revertedWith(
        "Can only eat plant food"
    );
  });
});
