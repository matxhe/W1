const { ethers } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const { BigNumber, defaultAbiCoder, formatEther } = require('ethers/lib/utils');


async function main(){

    let [owner, second] = await ethers.getSigners();

    const ADDRESS_PROVIDER = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
    let swapRouter ="0xE592427A0AEce92De3Edee1F18E0157C05861564";
    let routerV2Addr ="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

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

    let aaveFlashLoanSimple = await ethers.getContractFactory("aaveFlashLoanSimple");

    let flashSwap = await aaveFlashLoanSimple.deploy(ADDRESS_PROVIDER, routerV2Addr, swapRouter, tokenB.address, owner.address);
    await flashSwap.deployed();
    await writeAddr(flashSwap.address, "aaveFlashLoanSimple", network.name);

    console.log("aaveFlashLoanSimple address: ", flashSwap.address);

    const tokenAAmount = ethers.utils.parseUnits("5000", 18);

    tokenA.transfer(flashSwap.address, tokenAAmount);

    const BORROW_AMOUNT = ethers.utils.parseUnits("1000", 18);

    const tx = await flashSwap.testFlashLoan(tokenA.address, BORROW_AMOUNT, {
        from: WHALE,
      })
      for (const log of tx.logs) {
        console.log(log.args.message, log.args.val.toString())
      }

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });