// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let [owner, second] = await ethers.getSigners();

  // Deploy ERC20 Token
  const GGToken = await hre.ethers.getContractFactory("GGToken");
  const totalSupply = ethers.utils.parseUnits("100000",18);
  const token = await GGToken.deploy(totalSupply);
  await token.deployed();
  console.log("GGToken deployed to:", token.address);

  // deploy SuShi Token
  const SushiToken = await hre.ethers.getContractFactory("SushiToken");
  const sushiToken = await SushiToken.deploy();
  await sushiToken.deployed();
  console.log("SushiToken deployed to:", sushiToken.address);
  
  // deploy MasterChef
  const MasterChef = await hre.ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChef.deploy(sushiToken.address, second.address, "1000000000000000000000", "0", "1000000000000000000000");
  await masterChef.deployed();
  console.log("MasterChef deployed to:", masterChef.address);
  
  // transfer sushiToken ownership
  await sushiToken.transferOwnership(masterChef.address);

  const addLpTx = await masterChef.add(totalSupply, token.address, true);
  console.log("Add new lp to the pool, trx hash:", addLpTx.hash);
  const poolInfo = await masterChef.poolInfo(0);
  console.log("MasterChef poolInfo:", poolInfo.lpToken);


  // Deploy myTokenMarket
  const MyTokenMarket = await hre.ethers.getContractFactory("MyTokenMarket");
  const wEthAddress = "Cf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const routerAddress = "Dc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const market = await MyTokenMarket.deploy(token.address,wEthAddress,routerAddress,masterChef.address);
  await market.deployed();
  console.log("MyTokenMarket deployed to:", market.address);

  // add liquidity to market
  await token.approve(market.address,ethers.constants.MaxUint256);

  const ethAmount = ethers.utils.parseUnits("100",18);
  const tx = await market.AddLiquidity(totalSupply,{value: ethAmount});
  console.log("add liquidity to market(100000 GG tokens, 100 ETH) done, trx hash:", tx.hash);

  // check owner token balance
  let balance = await token.balanceOf(owner.address);
  console.log("Owner token balance before buy:" + ethers.utils.formatUnits(balance,18));

  // buy token from market with ETH
  const ethToBuy = ethers.utils.parseUnits("10",18);
  const buyOut = await market.buyToken("0",{value: ethToBuy}); 
  console.log("swap ETH => Token & deposit to masterChef done, trx hash:", buyOut.hash);

  // check owner token balance after bought
  balance = await token.balanceOf(owner.address);
  console.log("Owner token balance after swap:" + ethers.utils.formatUnits(balance,18));

  // withDraw token from masterChef
  const txWithdraw = await market.withDraw();
  console.log("withdraw Token from masterChef done, trx hash:", txWithdraw.hash);

  // check owner token balance after withdraw from masterChef
  balance = await token.balanceOf(owner.address);
  console.log("Owner token balance after withdraw from masterChef:" + ethers.utils.formatUnits(balance,18));

  
  // check owner sushi balance(reward) after withdraw from masterChef
  balance = await sushiToken.balanceOf(owner.address);
  console.log("Owner sushi balance(reward) after withdraw from masterChef:" + ethers.utils.formatUnits(balance,18));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
