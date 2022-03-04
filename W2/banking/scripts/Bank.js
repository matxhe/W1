const { ethers, network, artifacts } = require("hardhat");

async function main() {
    let BankArtifact = await artifacts.readArtifact("Bank");
    // console.log("Bank ABI:", BankArtifact.abi);

    let [owner]  = await ethers.getSigners();
    
    //console.log("owner:", owner);
    
    const bank = await ethers.getContractAt("Bank","0xfeA7AB8b96E68b87892cE60E74919a909A3c73a7",owner);

    let balance = await bank.getBalance();
    console.log(owner.address +" contract balance is:" + balance);

    // withdraw eth
    const transaction = await bank.withdraw();
    await transaction.wait();
    console.log(owner.address +" withdraw all ETH!");

    let newbalance = await bank.getBalance();
    console.log(owner.address +" contract new balance is:" + newbalance);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });