// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pixel is ERC20, Ownable {

    constructor() ERC20("Pixel", "PIXEL"){
        _mint(msg.sender, 100000000000000000000000000); //1,000,000,000 = 1 billion.
    }  

    function burn(uint256 amount) public onlyOwner {
        _burn(_msgSender(), amount);
    }
    
}