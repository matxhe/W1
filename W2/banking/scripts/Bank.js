const { ethers, network, artifacts } = require("hardhat");

async function main() {
    let BankArtifact = await artifacts.readArtifact("Bank");
    // console.log("Bank ABI:", BankArtifact.abi);

    let [owner]  = await ethers.getSigners();
    
    //console.log("owner:", owner);
    
    const bank = await ethers.getContractAt("Bank","0x2970d5D97AfE69Ef727Bb200b24edeA26deCBb25",owner);

    let balance = await bank.getBalance();
    console.log(owner.address +" contract balance is:" + balance);

    // // withdraw eth
    // const transaction = await bank.withdrawAll();
    // await transaction.wait();

    // let newbalance = await bank.getBalance();
    // console.log(owner.address +" contract new balance is:" + newbalance);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });