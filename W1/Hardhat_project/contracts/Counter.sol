// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Counter{
    uint public counter;

    constructor(){
        counter=0;
    }

    function count() public {
        counter++;
        console.log("counter is '%s'", counter);
    }
}