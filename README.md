# 欧科定向培训作业

# W6_1作业
* 设计一个看涨期权Token:
   * 创建期权Token 时，确认标的的价格与行权日期；
   * 发行方法（项目方角色）：根据转入的标的（ETH）发行期权Token；
   * （可选）：可以用期权Token 与 USDT 以一个较低的价格创建交易对，模拟用户购买期权。
   * 行权方法（用户角色）：在到期日当天，可通过指定的价格兑换出标的资产，并销毁期权Token
   * 过期销毁（项目方角色）：销毁所有期权Token 赎回标的。
——————————————
# W5_1作业
* 以太坊测试网上部署两个自己的ERC20合约MyToken，分别在Uniswap V2、V3(网页上)添加流动性
* 作业：编写合约执行闪电贷（参考V2的ExampleFlashSwap）：
   * uniswapV2Call中，用收到的 TokenA 在 Uniswap V3 的 SwapRouter 兑换为 TokenB 还回到 uniswapV2 Pair 中。
   
# W5_2作业
* 在一笔交易中完成（模拟闪电贷交易）
   * 在 AAVE 中借款 token A
   * 使用 token A 在 Uniswap V2 中交易兑换 token B，然后在 Uniswap V3 token B 兑换为 token A
   * token A 还款给 AAVE
————————————————————————————————

# W4_1作业
* 部署自己的 ERC20 合约 MyToken
* 编写合约 MyTokenMarket 实现：
   * AddLiquidity():函数内部调用 UniswapV2Router 添加 MyToken 与 ETH 的流动性
   主要注意点：添加流动性时要先调用myToken.approve授权给UniswapV2Router
   
   * buyToken()：用户可调用该函数实现购买 MyToken
   主要注意点：调用IUniswapV2Router01.swapExactETHForTokens 传入ETH兑换MyToken

npx hardhat run .\scripts\deploy.js --network dev

GGToken deployed to: 0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82

MyTokenMarket deployed to: 0x9A676e781A523b5d0C0e43731313A708CB607508

add liquidity to market(100000 GG tokens, 100 ETH) done, trx hash: 0x0522babede7b3209a6d9c6c309b70dd1b5c17e963e1dde633d6f9b26c229188f

Owner token holdings before buy:0.0

Owner token holdings after bought:9066.108938801491315813   
   

# W4_2作业
* 在上一次作业的基础上：
   * 完成代币兑换后，直接质押 MasterChef
   主要实现思路与注意点：1. 完成代币兑换后要先调用myToken.approve授权给MasterChef
					2. 代币兑换后先到MyTokenMarket而不是用户地址
					3. 然后从MyTokenMarket调用MasterChef.Deposit存入
			
   * withdraw():从 MasterChef 提取 Token 方法   
   主要实现思路与注意点：1. 从MyTokenMarket调用MasterChe.withdraw提取到MyTokenMarket
					2. 授权MyTokenMarket转出LP代币与SuShi奖励（Reward）
					3. 传回LP代币与Sushi给用户
					
					
npx hardhat run .\scripts\deploy.js --network dev

Compiled 15 Solidity files successfully

GGToken deployed to: 0xed12bE400A07910E4d4E743E4ceE26ab1FC9a961

SushiToken deployed to: 0x1B25157F05B25438441bF7CDe38A95A55ccf8E50

MasterChef deployed to: 0xc775bF567D67018dfFac4E89a7Cf10f0EDd0Be93

Add new lp to the pool, trx hash: 0xb9c7b71976b9aa8ccc385f36d0cbf3f7f8dc11ce695db8fab2641554bfbc9199

MasterChef poolInfo: 0xed12bE400A07910E4d4E743E4ceE26ab1FC9a961

MyTokenMarket deployed to: 0xFCa5Bb3732185AE6AaFC65aD8C9A4fBFf21DbaaD

add liquidity to market(100000 GG tokens, 100 ETH) done, trx hash: 0x07f6007473efdd25a22193dd8bac51da2f064ac52ba44e40f7d3101d5b9925b5

Owner token balance before buy:0.0

swap ETH => Token & deposit to masterChef done, trx hash: 0xbc018255ec4476e56ee1be22a2e6fc3f65c3accf12527b83bf3af751c2e070e8

Owner token balance after swap:0.0

withdraw Token from masterChef done, trx hash: 0x9da9695941277094e8005915f6059593d854a5faf1484cac091e0214a552ef2b

Owner token balance after withdraw from masterChef:9066.108938801491315813

Owner sushi balance(reward) after withdraw from masterChef:9999.999999997790306446
   
——————————————————————————————————————————————

# W3作业：

## Introduction

用ReactJs + esthers.Js 简单实现ERC20，ERC721与用户互动（授权，转帐，铸币，提现）作用

演示：https://matxhe.github.io/homework/

截图：
## ERC20

![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Dapp%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Dapp%20Approve%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Dapp%20Deposit%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Withdraw%20screen.png)
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC20%20Withdraw%20succeed%20screen.png)

## ERC721
![Screenshot](https://github.com/matxhe/homework/blob/main/W3/ERC721%20Transfer%20event.png)

部署到ropsten， https://ropsten.etherscan.io/address/0xd21edeaa807a072ee96b97a39b351499355ae93c

npx hardhat run .\scripts\deploy.js --network ropsten

         GGToken deployed to: 0xED580c3bA68242B0A9906910B7AeA5b4ea5F2Fe0
		 
         Vault deployed to: 0xD520a6394628149B607b35f75e6321F19FbbAca7
		 
         GG NFT deployed to: 0x310c83E572fd3870EC27BD1B43d8Ab2609AFA07c


# W2_1作业：

* 编写⼀个Bank合约：

Contract Address: 0xfeA7AB8b96E68b87892cE60E74919a909A3c73a7

* 通过 Metamask 向Bank合约转账ETH

Trx HASH: 0xad6e50c3bf24010ee0d6829b1402703545051eb05b4262fffd25a188e9a90b3a


* 在Bank合约记录每个地址转账⾦额
* 编写 Bank合约withdraw(), 实现提取出所有的 ETH

Trx HASH:0xad6e50c3bf24010ee0d6829b1402703545051eb05b4262fffd25a188e9a90b3a


https://ropsten.etherscan.io/tx/0xad6e50c3bf24010ee0d6829b1402703545051eb05b4262fffd25a188e9a90b3a

https://ropsten.etherscan.io/address/0x2970d5d97afe69ef727bb200b24edea26decbb25


# W2_2作业
* 编写合约Score，⽤于记录学⽣（地址）分数：

   * 仅有⽼师（⽤modifier权限控制）可以添加和修改学⽣分数

    modifier OnlyTeacher(){
    require(msg.sender == teacher, "Teacher Only!");
    _;
    }

   * 分数不可以⼤于 100；

   modifier CannotMoreThan100(address studentAddr){
         _;
        require(getScore(studentAddr) <= 100, "Cannot more than hundred!");
    } 
    
* 编写合约 Teacher 作为⽼师，通过 IScore 接⼝调⽤修改学⽣分数。

    function updateStudentScore(address score, address studentAddr, uint8 points) public{
        IScore(score).updateScore(studentAddr, points);
    }
