pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// This is the NFT management contract for dungeon entry.


contract DungeonKey is Ownable, ERC721 {

    constructor() ERC721("Dungeon Keys", "KEY") {
        
    } 
}