// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const stringComparerLib = await hre.ethers.getContractFactory("StringComparer");
  const stringComparer = await stringComparerLib.deploy();
  await stringComparer.deployed();
  console.log("StringComparer deployed to:", stringComparer.address);

  const cowContract = await hre.ethers.getContractFactory("Cow", { libraries: {StringComparer: stringComparer.address} });

  const horseContract = await hre.ethers.getContractFactory("Horse", { libraries: {StringComparer: stringComparer.address} });
  const woolfContract = await hre.ethers.getContractFactory("Woolf", { libraries: {StringComparer: stringComparer.address} });
  const farmerContract = await hre.ethers.getContractFactory("Farmer");



  const cow = await cowContract.deploy("cow");
  const horse = await horseContract.deploy("horse");
  const woolf = await woolfContract.deploy("woolf");
  const farmer = await farmerContract.deploy();

  await cow.deployed();
  await horse.deployed();
  await woolf.deployed();
  await farmer.deployed();

  console.log(farmer, 'farmer')
  const txFarmerCallCow = await farmer.call(cow.address);
  console.log("txFarmerCallCow:", txFarmerCallCow);
  const txFarmerCallHorse = await farmer.call(horse.address);
  console.log("txFarmerCallHorse:", txFarmerCallHorse);

  try {
    const txFarmerFeedWoolfPlant = await farmer.feed(woolf.address, "plant");
    console.log(txFarmerFeedWoolfPlant, 'txFarmerFeedWoolfPlant')
  } catch (err) {
    console.log('error', err.reason);
  }

  const txFarmerFeedWoolfMeat = await farmer.feed(woolf.address, "meat");
  console.log(txFarmerFeedWoolfMeat, "txFarmerFeedWoolfMeat");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});