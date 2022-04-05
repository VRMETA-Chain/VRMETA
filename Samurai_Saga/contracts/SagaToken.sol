// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SAGA is ERC20, Ownable {
    DogeStore public dogestore;

    constructor() ERC20("Samurai Saga", "SAGA"){
        _mint(msg.sender, 500000000000000000000000000); //500,000,000 = 500 million.
    }  
    
}
