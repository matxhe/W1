//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import '../contracts/interfaces/IUniswapV2Callee.sol';
import '../contracts/interfaces/IUniswapV2Factory.sol';
import '../contracts/libraries/UniswapV2Library.sol';
import '../contracts/libraries/LowGasSafeMath.sol';
// import '../contracts/interfaces/V1/IUniswapV1Factory.sol';
// import '../contracts/interfaces/V1/IUniswapV1Exchange.sol';
// import '../contracts/interfaces/IUniswapV2Router02.sol';
// import '../contracts/interfaces/IERC20.sol';
import '../contracts/interfaces/V3/ISwapRouter.sol';

contract ExampleFlashSwap is IUniswapV2Callee {
    using SafeERC20 for IERC20;
    // IUniswapV1Factory immutable factoryV1;
    // address immutable factoryV2;

    // IWETH immutable WETH;
    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;
    address immutable swapRouter;

    event Log(string message, uint amount);
    event LogBytes(bytes data);

    constructor(
         //address _factoryV2, 
         address _swapRouter
         //, address v2router02
         ) {
        // factoryV1 = IUniswapV1Factory(_factoryV1);
        swapRouter = _swapRouter;
        // factoryV2 = _factoryV2;
        // WETH = IWETH(IUniswapV2Router02(v2router02).WETH());
    }

    // needs to accept ETH from any V1 exchange and WETH. ideally this could be enforced, as in the router,
    // but it's not possible because it requires a call to the v1 factory, which takes too much gas
    receive() external payable {}

    // gets tokens/WETH via a V2 flash swap, swaps for the ETH/tokens on V1, repays V2, and keeps the rest!
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external override {
        address[] memory path = new address[](2);
        // uint amountToken;
        // uint amountETH;
        { // scope for token{0,1}, avoids stack too deep errors
            address token0 = IUniswapV2Pair(msg.sender).token0();
            address token1 = IUniswapV2Pair(msg.sender).token1();
            // assert(msg.sender == UniswapV2Library.pairFor(factoryV2, token0, token1)); // ensure that msg.sender is actually a V2 pair
            assert(amount0 == 0 || amount1 == 0); // this strategy is unidirectional
            path[0] = token0;
            path[1] = token1;
            // amountToken = token0 == address(WETH) ? amount1 : amount0;
            // amountETH = token0 == address(WETH) ? amount0 : amount1;
        }

        // assert(path[0] == address(WETH) || path[1] == address(WETH)); // this strategy only works with a V2 WETH pair

        // IERC20 token = IERC20(path[0] == address(WETH) ? path[1] : path[0]);
        // IUniswapV1Exchange exchangeV1 = IUniswapV1Exchange(factoryV1.getExchange(address(token))); // get V1 exchange

        // V3    
        IERC20 tokenA = IERC20(path[0]); // token In
        IERC20 tokenB = IERC20(path[1]);  // token out
        uint256 amount0Min = LowGasSafeMath.add(amount0, poolFee);
        uint256 amount1Min = LowGasSafeMath.add(amount1, poolFee);

        if (amount0 > 0) {
            // 套利
            // V3
            // Approve the router to spend tokenA/B.
            IERC20(tokenA).safeApprove(address(swapRouter), amount0);
            // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
            // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
            ISwapRouter.ExactInputSingleParams memory params =
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: address(tokenA),
                    tokenOut: address(tokenB),
                    fee: poolFee,
                    recipient: address(this),// msg.sender,
                    deadline: block.timestamp,
                    amountIn: amount0,
                    amountOutMinimum: amount1Min,
                    sqrtPriceLimitX96: 0
                });

            // The call to `exactInputSingle` executes the swap.
            uint amountReceived = ISwapRouter(swapRouter).exactInputSingle(params); // token B received

            assert(tokenA.transfer(msg.sender, amount0)); // return tokenA to V2 pair
            assert(amountReceived > amount0Min);
            uint256 balance = amountReceived - amount0Min;

            assert(tokenA.transfer(sender, balance)); // keep the rest! 

            // uint amountRequired = UniswapV2Library.getAmountsIn(factoryV2, amountToken, path)[0];
            // assert(amountReceived > amountRequired); // fail if we didn't get enough ETH back to repay our flash loan
            // // WETH.deposit{value: amountRequired}();
            
            // (bool success,) = sender.call{value: amountReceived - amountRequired}(new bytes(0)); // keep the rest! 
            // assert(success);
        } else {
            // V3
            // Approve the router to spend tokenA/B.
            IERC20(tokenB).safeApprove(address(swapRouter), amount1);
            // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
            // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
            ISwapRouter.ExactInputSingleParams memory params =
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: address(tokenB),
                    tokenOut: address(tokenA),
                    fee: poolFee,
                    recipient: address(this),// msg.sender,
                    deadline: block.timestamp,
                    amountIn: amount1,
                    amountOutMinimum: amount0Min,
                    sqrtPriceLimitX96: 0
                });

            // The call to `exactInputSingle` executes the swap.
            uint amountReceived = ISwapRouter(swapRouter).exactInputSingle(params); // token A received

            assert(tokenB.transfer(msg.sender, amount1)); // return tokenB to V2 pair
            assert(amountReceived > amount1Min);
            uint256 balance = amountReceived - amount1Min;

            assert(tokenB.transfer(sender, balance)); // keep the rest! 
        }
    }


    // function swapAtV2(address tokenBorrow, address tokenProvide, uint amount) external{
    //     address pairAddress = IUniswapV2Factory(factoryV2).getPair(tokenBorrow, tokenProvide);
    //     require(pairAddress != address(0), "token pair not found!");
    //     address token0 = IUniswapV2Pair(pairAddress).token0();
    //     address token1 = IUniswapV2Pair(pairAddress).token1();
    //     uint amount0Out = tokenBorrow == token0 ? amount : 0;
    //     uint amount1Out = tokenBorrow == token1 ? amount : 0;

    //     // IERC20(tokenProvide).safeApprove(address(this), amount);
    //     // IERC20(tokenProvide).safeTransferFrom(msg.sender, address(this), amount);

    //     // need to pass some data to trigger uniswapV2Call
    //     bytes memory data = abi.encode(tokenBorrow, amount);

    //     try IUniswapV2Pair(pairAddress).swap(amount0Out, amount1Out, address(this), "") {
    //         // you can use variable foo here
    //         //emit Log("swap done", amount);
    //     } catch Error(string memory reason) {
    //         // catch failing revert() and require()
    //         emit Log(reason, amount);
    //     } catch (bytes memory reason) {
    //         // catch failing assert()
    //         emit LogBytes(reason);
    //     }
    //     //IUniswapV2Pair(pairAddress).swap(amount0Out, amount1Out, address(this), data);
    // }

    // // get UniswapV2Pair address
    // function getUniswapV2PairAddress(address tokenA, address tokenB) external view returns (address){
    //     address pairAddress = UniswapV2Library.pairFor(factoryV2, tokenA, tokenB);
    //     return pairAddress;
    // }

    // // get Token0 address
    // function getToken0Address(address pairAddress) external view returns (address){
    //     address token0 = IUniswapV2Pair(pairAddress).token0();
    //     return token0;
    // }

    // // get owner Token0 balance
    // function balanceOfToken0(address pairAddress, address owner) external view returns (uint){
    //     address token0 = IUniswapV2Pair(pairAddress).token0();
    //     return IERC20(token0).balanceOf(owner);
    // }

    // // get Token1 address
    // function getToken1Address(address pairAddress) external view returns (address){
    //     address token1 = IUniswapV2Pair(pairAddress).token1();
    //     return token1;
    // }

    // // get owner Token1 balance
    // function balanceOfToken1(address pairAddress, address owner) external view returns (uint){
    //     address token1 = IUniswapV2Pair(pairAddress).token1();
    //     return IERC20(token1).balanceOf(owner);
    // }



}
