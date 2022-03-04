const { ethers, network, artifacts } = require("hardhat");

async function main() {
    let GreeterArtifact = await artifacts.readArtifact("Greeter");
    // console.log("Greeter ABI:", GreeterArtifact.abi);

    let [owner]  = await ethers.getSigners();
    
    //console.log("owner:", owner);
    
    const greeter = await ethers.getContractAt("Greeter","0x92EDc45fcDB77C1D60Fb2074A14920093D6C7E3A",owner);

    const transaction = await greeter.setGreeting("Hi Max!");
    await transaction.wait();

    let newGreet = await greeter.greet();
    console.log("greeter contract greet is:" + newGreet);

    let balance = await greeter.getBalance();
    console.log("greeter contract balance is:" + balance);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });