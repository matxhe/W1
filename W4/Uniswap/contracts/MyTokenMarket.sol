//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./IUniswapV2Router01.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./MasterChef.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public ggTokenAddress;
    address public wEthAddress;
    address public router;
    address public masterChef;

    constructor(address _token, address _weth, address _router, address _masterChef){
        ggTokenAddress = _token;
        router = _router;
        wEthAddress = _weth;
        masterChef = _masterChef;
    }

    // add liquidity
    function AddLiquidity(uint tokenAmt) external payable{
        IERC20(ggTokenAddress).safeTransferFrom(msg.sender, address(this), tokenAmt); // safe transfer token from owner to market contract
        
        IERC20(ggTokenAddress).safeApprove(router, tokenAmt); //safe approve router contract to spend sender token
        
        console.log("router address:", router);
        // add token to liquidity pool
        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(
                ggTokenAddress,
                tokenAmt,
                0,
                0,
                msg.sender,
                block.timestamp
        );
    }

    function buyToken(uint minTokenAmount) external payable{

        console.log("------------ buyToken function ------");
        //[WETH,GG]
        address[] memory path = new address[](2);
        path[0] = wEthAddress;
        path[1] = ggTokenAddress;

        // swap token with ETH
        IUniswapV2Router01(router).swapExactETHForTokens{value: msg.value}(minTokenAmount, path, address(this), block.timestamp);

        // get sender token balance
        uint256 balanceToken = IERC20(ggTokenAddress).balanceOf(address(this));
        console.log("MyTokenMarket Token balance :", balanceToken);
        // 授权 MasterChef
        IERC20(ggTokenAddress).safeApprove(masterChef, balanceToken); //safe approve MasterChef contract to spend sender token
        // // 授权 MyTokenMarket
        // IERC20(ggTokenAddress).safeApprove(address(this), balanceToken);

        // console.log("MasterChef owner address:", Ownable(masterChef).owner());
        // console.log("Caller address:", msg.sender);

        //IERC20(ggTokenAddress).safeTransferFrom(msg.sender, address(this), balanceToken);
        // 质押token到 MasterChef        
        uint256 _pid = 0;
        MasterChef(masterChef).deposit(_pid, balanceToken);
        // (bool success, bytes memory data) = masterChef.delegatecall(abi.encodeWithSignature("deposit(uint256 _pid, uint256 _amount)", _pid, balanceToken));
        // require(!success,"Deposit to masterChef Fail!");

        uint256 tokenBalance = MasterChef(masterChef).balanceOf(_pid, address(this));
        console.log("MyTokenMarket token balance:", tokenBalance);
    }

    // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
    //   1. The pool's `accSushiPerShare` (and `lastRewardBlock`) gets updated.
    //   2. User receives the pending reward sent to his/her address.
    //   3. User's `amount` gets updated.
    //   4. User's `rewardDebt` gets updated.
    function withDraw() external{
        console.log("------------ withDraw function ------");
        //从 MasterChef 提取 Token 方法
        uint256 _pid = 0;
        console.log("Caller address 1:", msg.sender);
        uint256 tokenBalance = MasterChef(masterChef).balanceOf(_pid, msg.sender);
        console.log("Caller token balance:", tokenBalance);
        console.log("MyTokenMarket address:", address(this));
        tokenBalance = MasterChef(masterChef).balanceOf(_pid, address(this));
        console.log("MyTokenMarket token balance:", tokenBalance);
        
        
        // Ownable(masterChef).transferOwnership(masterChef);

        MasterChef(masterChef).withdraw(_pid, tokenBalance); 
        // bytes memory methodData = abi.encodeWithSignature("withdraw(uint256,uint256)", _pid, tokenBalance);
        // (bool success, bytes memory data) = masterChef.delegatecall(methodData);
        // console.log("success :", success);
        // require(success,"withDraw from masterChef Fail!");
        console.log("MyTokenMarket address:", address(this));
        tokenBalance = IERC20(ggTokenAddress).balanceOf(address(this));
        console.log("MyTokenMarket token wallet balance:", tokenBalance);

        // 授权给自己
        IERC20(ggTokenAddress).safeApprove(address(this), tokenBalance); 
        IERC20(ggTokenAddress).safeTransferFrom(address(this), msg.sender, tokenBalance); 


        tokenBalance = IERC20(MasterChef(masterChef).sushi()).balanceOf(address(this));
        console.log("MyTokenMarket sushi wallet balance:", tokenBalance);
        
        // 授权给自己
        IERC20(MasterChef(masterChef).sushi()).safeApprove(address(this), tokenBalance);         
        IERC20(MasterChef(masterChef).sushi()).safeTransferFrom(address(this), msg.sender, tokenBalance);
    }

}