//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault{

    //记录每个⽤户存款⾦额
    mapping(address=>uint256) balanceOf;

    //ERC20 Token contract
    address ggToken;

    constructor(address _ggToken){
        ggToken = _ggToken;
    }

    //编写deposite ⽅法，实现 ERC20 存⼊ Vault，并记录每个⽤户存款⾦额
    function deposit(uint256 tokens) external{
        console.log("Caller address:'%s'", msg.sender);
        console.log("Vault address is '%s'", address(this));
        console.log("ERC20 Token contract address:'%s'", ggToken);
        bool result = IERC20(ggToken).transferFrom(msg.sender, address(this), tokens); 
        require(result,"Deposit fail!");
        balanceOf[msg.sender] += tokens;
    }

    //编写 withdraw ⽅法，提取⽤户⾃⼰的存款 （前端调⽤）
    function withdraw(uint256 tokens) external{
        bool result = IERC20(ggToken).transfer(msg.sender, tokens);
        require(result,"withdraw fail!");
        balanceOf[msg.sender] -= tokens;
    }

    // return user balance
    function getBalance() public view returns (uint256) {
        return balanceOf[msg.sender];
    }
}

