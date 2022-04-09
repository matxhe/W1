//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

// ETH Call Option
contract CallToken is ERC20, Ownable {
  using SafeERC20 for IERC20;

  uint public price;
  address public udscToken;
  uint public settlementTime;
  uint public constant during = 1 days; // 1 day

  constructor(address usdc) ERC20("CallToken", "CALLA") {
    udscToken = usdc;
    price = 10;
    settlementTime = block.timestamp + 100 days;
  }

  function mint() external payable onlyOwner {
    _mint(msg.sender, msg.value);
    console.log("------------ mint function ------");
    console.log("block.timestamp:", block.timestamp);
  }

  function settlement(uint amount) external {
    console.log("------------ settlement function ------");
    console.log("block.timestamp:", block.timestamp);
    console.log("settlementTime + during :", settlementTime + during);
    require(block.timestamp >= settlementTime && block.timestamp < settlementTime + during, "invalid time");

    _burn(msg.sender, amount);

    uint needUsdcAmount = price * amount;

    IERC20(udscToken).safeTransferFrom(msg.sender, address(this), needUsdcAmount);
    safeTransferETH(msg.sender, amount);
  }

  function safeTransferETH(address to, uint256 value) internal {
    (bool success, ) = to.call{value: value}(new bytes(0));
    require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
  }

  function burnAll() external onlyOwner {
    require(block.timestamp >= settlementTime + during, "not end");
    uint usdcAmount = IERC20(udscToken).balanceOf(address(this));
    IERC20(udscToken).safeTransfer(msg.sender, usdcAmount);


    selfdestruct(payable(msg.sender));
  }


}