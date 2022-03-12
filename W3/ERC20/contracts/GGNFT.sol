//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GGNFT is ERC721{
    constructor () ERC721("Mint GG NFT as you like!","GGNFT"){
        
    }

    function mintOneNFT(uint256 tokenId) public {
        _safeMint(msg.sender, tokenId);
    }

}