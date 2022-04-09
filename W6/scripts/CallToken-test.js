let { ethers } = require("hardhat");
let { writeAddr } = require('./artifact_log.js');

async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    let TokenA = await ethers.getContractFactory("ERC20Token");
    let aAmount = ethers.utils.parseUnits("100000", 18);
    let tokenA = await TokenA.deploy(
        "TokenAc",
        "TokenAc",
        aAmount);

    await tokenA.deployed();
    await writeAddr(tokenA.address, "TokenA", network.name);
    console.log("TokenA deployed to:", tokenA.address);

    let CallToken = await ethers.getContractFactory("CallToken");
    let callToken = await CallToken.deploy(tokenA.address);

    await callToken.deployed();
    console.log("Call Token address:" + callToken.address);

    await callToken.mint({value:20});

    await callToken.transfer(second.address,10);

    console.log("Call Token balance on 2nd account:" + await callToken.balanceOf(second.address));

    await network.provider.send("evm_increaseTime", [100*24*3600+1]);

    await tokenA.approve(callToken.address, ethers.constants.MaxUint256); 
    await callToken.settlement(10);

    await network.provider.send("evm_increaseTime", [24*3600+1]);
    await callToken.burnAll();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });