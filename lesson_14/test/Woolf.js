const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const hre = require("hardhat");

describe("Dog", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDog() {
    const HORSE_NAME = 'dog';
    const PLANT = 'plant';
    const NOT_FOOD = 'not-food';
    const PLASTIC = 'plastic'
    const MEAT = 'meat'
    const stringComparerLib = await hre.ethers.getContractFactory("StringComparer");
    const stringComparer = await stringComparerLib.deploy();
    await stringComparer.deployed();
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const DogContract = await hre.ethers.getContractFactory("Dog",  { libraries: {StringComparer: stringComparer.address}});
    const dog = await DogContract.deploy(HORSE_NAME);
    const farmerContract = await hre.ethers.getContractFactory("Farmer");
    const farmer = await farmerContract.deploy();

    return { dog, farmer, owner, otherAccount, HORSE_NAME, PLANT, NOT_FOOD, PLASTIC, MEAT};
  }

  it('Dog has the correct name. ', async function () {
    const {dog, HORSE_NAME } = await loadFixture(deployDog);

    expect(await dog.getName()).to.equal(HORSE_NAME);
  });

  it('Dog can sleep.', async function () {
    const {dog } = await loadFixture(deployDog);

    expect(await dog.sleep).to.be.a('function');
  });

  it('Dog can eat “plant”', async function () {

    const {dog, PLANT } = await loadFixture(deployDog);

    expect(await dog.eat(PLANT)).not.to.be.reverted;
  });

  it('Dog cannot eat ”meat”, ”not-food”, ”plastic”.', async function () {
    const NOT_FOOD = 'not-food';
    const PLASTIC = 'plastic'
    const MEAT = 'meat'

    const {dog } = await loadFixture(deployDog);

    expect(dog.eat(NOT_FOOD)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(dog.eat(PLASTIC)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(dog.eat(MEAT)).to.be.revertedWith(
        "Can only eat plant food"
    );
  });

  it('Farmer can call Dog, Dog responds correctly', async function () {
    const SOUND_OF_HORSE = 'Igogo'
    const {dog,farmer } = await loadFixture(deployDog);

    expect(farmer.call(dog.address)).to.be.revertedWith(
        SOUND_OF_HORSE
    );
  });

  it('Farmer can feed Dog with plant', async function () {
    const {dog,farmer, PLANT } = await loadFixture(deployDog);

    expect(farmer.feed(dog.address, PLANT)).not.to.be.reverted;
  });

  it.only('Farmer cannot feed Dog with anything else', async function () {
    const {dog,farmer, NOT_FOOD, PLASTIC, MEAT } = await loadFixture(deployDog);

    expect(farmer.feed(dog.address, NOT_FOOD)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(farmer.feed(dog.address, PLASTIC)).to.be.revertedWith(
        "Can only eat plant food"
    );
    expect(farmer.feed(dog.address, MEAT)).to.be.revertedWith(
        "Can only eat plant food"
    );
  });
});
