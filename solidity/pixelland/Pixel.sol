// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PIXEL is ERC20, Ownable {
    DogeStore public dogestore;

    constructor() ERC20("Pixel", "PIXEL"){
        _mint(msg.sender, 100000000000000000000000000); //100,000,000 = 100 million.
    }  
    
}
