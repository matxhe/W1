const { ethers } = require("hardhat");
const { writeAddr } = require('./artifact_log.js');
const { BigNumber, defaultAbiCoder, formatEther } = require('ethers/lib/utils');
// const bre = require('@nomiclabs/buidler');
// const { MaxUint256 } = require('ethers/constants');

const ExampleFlashSwapDeployed = require(`../deployments/${network.name}/ExampleFlashSwap.json`);

let pairAbi=require(`../deployments/abi/UniswapV2Pair.json`);
let routerV2Abi = require(`../deployments/abi/UniswapV2Router01.json`);
let factoryV2Abi = require(`../deployments/abi/UniswapV2Factory.json`);

async function parseLogBytesEvent(event) {
  
    const LogBytesEvent = new ethers.utils.Interface(["event LogBytes(bytes data)"]);
    let decodedData = LogBytesEvent.parseLog(event);
    console.log("data:" + decodedData.args.data.toString());
    // console.log("to:" + decodedData.args.to);
    // console.log("value:" + decodedData.args.value.toString());
}

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

    // let tokenV2Pair = "0x8f18e287DFe73BF4D67E1460F98A795948320ed1";
    let factoryV2Addr = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    let swapRouter ="0xE592427A0AEce92De3Edee1F18E0157C05861564";
    let routerV2Addr ="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    console.log("bigNumberify test",ethers.BigNumber.from(1));
    console.log("encode test",defaultAbiCoder.encode(['uint'], [ethers.BigNumber.from(0)]));
    const bytes = ethers.utils.arrayify('0x00');
    console.log("bytes test",bytes);

    let ExampleFlashSwap = await ethers.getContractFactory("ExampleFlashSwap");
    // let flashSwap = await ExampleFlashSwap.deploy(factoryV2Addr, swapRouter, routerV2Addr);
    let flashSwap = await ExampleFlashSwap.deploy(swapRouter);
    await flashSwap.deployed();
    await writeAddr(flashSwap.address, "ExampleFlashSwap", network.name);

    // let flashSwap = await ethers.getContractAt("ExampleFlashSwap", ExampleFlashSwapDeployed.address, second);
    // await flashSwap.deployed();

    console.log("ExampleFlashSwap address: ", flashSwap.address);
    
    
    let routerV2 = new ethers.Contract(routerV2Addr, routerV2Abi.abi, owner);
    console.log("routerV2 address:", routerV2.address);

    let factoryV2 = new ethers.Contract(factoryV2Addr, factoryV2Abi.abi, owner);
    console.log("factoryV2 address:", factoryV2.address);

    await factoryV2.createPair(tokenA.address, tokenB.address);


    let tokenV2Pair = await factoryV2.getPair(tokenA.address, tokenB.address)
    console.log("V2 Pair address:", tokenV2Pair);

    let v2Pair   = new ethers.Contract(tokenV2Pair, pairAbi.abi, owner);

    // add event listener
    

    let filterLog = {
        address: flashSwap.address,
        topics: [
          ethers.utils.id("Log(string,uint)")
        ]
      }
    ethers.provider.on(filterLog, (event) => {

        // console.log(event);

        const LogEvent = new ethers.utils.Interface(["event Log(string message,uint amount)"]);
        let decodedData = LogEvent.parseLog(event);
        console.log("error message:" + decodedData.args.message.toString() + ",amount=" + decodedData.args.amount.toString());
    })

    let filterLogBytes = {
        address: flashSwap.address,
        topics: [
          ethers.utils.id("LogBytes(bytes)")
        ]
      }
    ethers.provider.on(filterLogBytes, (event) => {

        //console.log(event)

        // const decodedEvent = myerc20.interface.decodeEventLog(
        //     "Transfer", //
        //     event.data,
        //     event.topics
        // );
        // console.log(decodedEvent);

        parseLogBytesEvent(event);
    })

    ethers.provider.on("error", (tx) => {
        // Emitted when any error occurs
        console.log(tx);
    });
    // end event listener


    // console.log("IUniswapV2Pair address: ", tokenV2Pair);
    // let tokenV2PairTest = await flashSwap.getUniswapV2PairAddress(tokenA, tokenB);
    // console.log("IUniswapV2Pair Create2 Test address: ", tokenV2PairTest);

    // console.log("tokenA address: ", tokenA);
    // let token1 = await flashSwap.getToken1Address(tokenV2PairTest);
    // console.log("token1 address: ", token1);

    // console.log("tokenB address: ", tokenB);
    // let token0 = await flashSwap.getToken0Address(tokenV2PairTest);
    // console.log("token0 address: ", token0);


    const tokenAAmount = ethers.utils.parseUnits("100", 18);
    const tokenBAmount = ethers.utils.parseUnits("400", 18);

    await tokenA.approve(routerV2Addr, ethers.constants.MaxUint256);
    await tokenB.approve(routerV2Addr, ethers.constants.MaxUint256);


    await routerV2.addLiquidity(
      tokenA.address,
      tokenB.address,
      tokenAAmount,
      tokenBAmount,
      0,
      0,
      owner.address,
      ethers.constants.MaxUint256
    );

    // check owner token 0 balance before swap
    // balanceA = await flashSwap.balanceOfToken0(tokenV2PairTest, owner.address);
    const balanceA = await tokenA.balanceOf(owner.address);
    console.log("Owner token 0 balance before swap:" + ethers.utils.formatUnits(balanceA,18));

    
    // check owner token 1 balance before swap
    // balanceB = await flashSwap.balanceOfToken1(tokenV2PairTest, owner.address);
    const balanceB = await tokenB.balanceOf(owner.address);
    console.log("Owner token 1 balance before swap:" + ethers.utils.formatUnits(balanceB,18));


    // swap tokenB to tokenA at uniswap V2
    const amount0 = ethers.utils.parseUnits("1", 18);
    const amount1 = ethers.utils.parseUnits("4", 18);
    let n=ethers.utils.parseUnits("1", 18);

    
    await v2Pair.swap(
      amount0,
      amount1,
      flashSwap.address,
      ethers.utils.defaultAbiCoder.encode(['uint'], [n])
    );
    
    // check owner token 0 balance before swap
    const balanceAAfter = await tokenA.balanceOf(owner.address);
    console.log("Owner token 0 balance after swap:" + ethers.utils.formatUnits(balanceAAfter,18));

    
    // check owner token 1 balance before swap
    const balanceBAfter = await tokenB.balanceOf(owner.address);
    console.log("Owner token 1 balance after swap:" + ethers.utils.formatUnits(balanceBAfter,18));

    let a = balanceAAfter-balanceA;
    let b = balanceBAfter-balanceB;
    console.log("tokenA diff:",a);
    console.log("tokenB diff:",b);


}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });