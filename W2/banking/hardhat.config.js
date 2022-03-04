require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim();
const scankey = '3E66SQH58TVPZHKA4Q7UMDI4HVXBYJUCKP';


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    hardhat:{
      chainId:1337,
      gas: 2100000,
      gasPrice: 8000000000
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/890a9bd025d54a7da8d7ba259d5d5df9",
      accounts: [`0x${privateKey}`],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: scankey
  }
};
