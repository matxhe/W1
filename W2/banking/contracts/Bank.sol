// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Bank {
    address payable public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint) balances;

    constructor() {
        owner = payable(msg.sender);
        balances[owner] = 0;
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
        console.log("caller address:'%s', value is '%s'", msg.sender, msg.value);
    }

    function withdrawSome(uint _amount) external {
        // require(msg.sender == owner, "caller is not owner");
        require(balances[msg.sender] - _amount > 0,"Insufficient Balance!");
        payable(msg.sender).transfer(_amount);
        balances[msg.sender] = getBalance();
    }

    function withdraw() external {
        // require(msg.sender == owner, "caller is not owner");
        require(balances[msg.sender] > 0,"Insufficient Balance!");
        //payable(msg.sender).transfer(balances[msg.sender]);
        address payable to = payable(msg.sender);
        to.transfer(getBalance());
        balances[msg.sender] = getBalance();
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}