// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Bank {
    address payable public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint) public balances;

    constructor() {
        owner = payable(msg.sender);
        balances[owner] = 0;
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
        console.log("caller address:'%s', value is '%s'", msg.sender, msg.value);
    }

    function withdraw(uint _amount) external {
        // require(msg.sender == owner, "caller is not owner");
        require(balances[msg.sender] - _amount > 0,"Insufficient Balance!");
        payable(msg.sender).transfer(_amount);
    }

    function withdrawAll() external {
        // require(msg.sender == owner, "caller is not owner");
        require(balances[msg.sender] > 0,"Insufficient Balance!");
        payable(msg.sender).transfer(balances[msg.sender]);
    }

    function getBalance() external view returns (uint) {
        //return address(this).balance;
        return balances[msg.sender];
    }
}