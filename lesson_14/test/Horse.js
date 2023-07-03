const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");

describe("Horse", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployHorse() {
    const HORSE_NAME = 'horse';
    const PLANT = 'plant';
    const NOT_FOOD = 'not-food';
    const PLASTIC = 'plastic'
    const MEAT = 'meat'
    const stringComparerLib = await hre.ethers.getContractFactory("StringComparer");
    const stringComparer = await stringComparerLib.deploy();
    await stringComparer.deployed();
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const HorseContract = await hre.ethers.getContractFactory("Horse",  { libraries: {StringComparer: stringComparer.address}});
    const horse = await HorseContract.deploy(HORSE_NAME);
    const farmerContract = await hre.ethers.getContractFactory("Farmer");
    const farmer = await farmerContract.deploy();

    return { horse, farmer, owner, otherAccount, HORSE_NAME, PLANT, NOT_FOOD, PLASTIC, MEAT};
  }

  it('Horse has the correct name. ', async function () {
    const {horse, HORSE_NAME } = await loadFixture(deployHorse);

    expect(await horse.getName()).to.equal(HORSE_NAME);
  });

  it('Horse can sleep.', async function () {
    const {horse } = await loadFixture(deployHorse);

    expect(await horse.sleep).to.be.a('function');
  });

  it('Horse can eat “plant”', async function () {

    const {horse, PLANT } = await loadFixture(deployHorse);

    expect(await horse.eat(PLANT)).not.to.be.reverted;
  });

  it('Horse cannot eat ”meat”, ”not-food”, ”plastic”.', async function () {
    const NOT_FOOD = 'not-food';
    const PLASTIC = 'plastic'
    const MEAT = 'meat'

    const {horse } = await loadFixture(deployHorse);

    expect(horse.eat(NOT_FOOD)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(horse.eat(PLASTIC)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(horse.eat(MEAT)).to.be.revertedWith(
        "Can only eat plant food"
    );
  });

  it('Farmer can call Horse, Horse responds correctly', async function () {
    const SOUND_OF_HORSE = 'Igogo'
    const {horse,farmer } = await loadFixture(deployHorse);

    expect(farmer.call(horse.address)).to.be.revertedWith(
        SOUND_OF_HORSE
    );
  });

  it('Farmer can feed Horse with plant', async function () {
    const {horse,farmer, PLANT } = await loadFixture(deployHorse);

    expect(farmer.feed(horse.address, PLANT)).not.to.be.reverted;
  });

  it('Farmer cannot feed Horse with anything else', async function () {
    const {horse,farmer, NOT_FOOD, PLASTIC, MEAT } = await loadFixture(deployHorse);

    expect(farmer.feed(horse.address, NOT_FOOD)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(farmer.feed(horse.address, PLASTIC)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(farmer.feed(horse.address, MEAT)).to.be.revertedWith(
        "Can only eat plant food"
    );
  });
});
