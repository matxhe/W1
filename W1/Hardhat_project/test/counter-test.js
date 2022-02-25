const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function (){
    it("Should be return 1", async function(){
        // We get the contract to deploy
        const Counter = await hre.ethers.getContractFactory("Counter");
        const counter = await Counter.deploy();
    
        var counterInstance = await counter.deployed();
        await counterInstance.count();
        expect(await counterInstance.counter()).to.equal(1);
    });
});