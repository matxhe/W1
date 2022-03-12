//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GGToken is ERC20{
    constructor (uint256 tokens) ERC20("GG Token","GG"){
        _mint(msg.sender, tokens);
    }

    function mint(uint256 tokens) public {
        _mint(msg.sender, tokens);
    }

}