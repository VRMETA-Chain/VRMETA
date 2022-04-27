// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Factions is Ownable {

    struct Faction {
        address leader;
        uint members;
        uint pixelTreasury;
        bool councilMember;
    }

    constructor() {
       
    }  

   
    
}