const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault", function () {
  it("Vault contract should able deposit", async function () {

    let [owner]  = await ethers.getSigners();

    const GGToken = await hre.ethers.getContractFactory("GGToken");
    const totalToken = ethers.utils.parseUnits("1000",18);
    const ggToken = await GGToken.deploy(totalToken);
  
    console.log("GGToken deployed to:", ggToken.address);

    // ggToken = await ethers.getContractAt("GGToken", ggToken.address, owner);
    await ggToken.deployed();
  
    const VaultC = await hre.ethers.getContractFactory("Vault");
    const vault = await VaultC.deploy(ggToken.address);
  
    await vault.deployed();
  
    console.log("Vault deployed to:", vault.address);
    
    const amount = ethers.utils.parseUnits("1000",18);
    
    // //mint token
    // const mintResult = await ggToken.mint(amount);
    // // wait until the transaction is mined
    // await mintResult.wait();

    // Approve
    const approveResult = await ggToken.approve(vault.address,amount);
    // wait until the transaction is mined
    await approveResult.wait();

    // deposit to vault
    const depositResult = await vault.deposit(amount);
    // wait until the transaction is mined
    await depositResult.wait();

    let balance = await vault.getBalance();

    expect(balance).to.equal(amount);
  });
});
