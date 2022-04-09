const { ethers } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

async function main(){

    let [owner, second] = await ethers.getSigners();

    // Deploy ERC20 Token
    let TokenA = await ethers.getContractFactory("ERC20Token");
    let aAmount = ethers.utils.parseUnits("100000", 18);
    let tokenA = await TokenA.deploy(
        "TokenA",
        "TokenA",
        aAmount);

    await tokenA.deployed();
    await writeAddr(tokenA.address, "TokenA", network.name);
    console.log("TokenA deployed to:", tokenA.address);

    let TokenB = await ethers.getContractFactory("ERC20Token");
    let bAmount = ethers.utils.parseUnits("200000", 18);
    let tokenB = await TokenB.deploy(
        "TokenB",
        "TokenB",
        bAmount);

    await tokenB.deployed();
    await writeAddr(tokenB.address, "TokenB", network.name);
    console.log("TokenB deployed to:", tokenB.address);

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });