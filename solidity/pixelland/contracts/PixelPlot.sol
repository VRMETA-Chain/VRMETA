pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721A.sol";

/// This is Pixelland's alpha-stage Land buying and Map expansion DAO.  
/// Landowners have the right to vote on map-extension proposals, and
/// the owner of the contract is in charge of accepting proposals for
/// land sales.  Ownership will be transferred to the Pixelland Stakers
/// in production.


///***VRMETA WILL LATER BE USED TO UPGRADE THE COORIDINATE-CHECKING ITERATION SYSTEM TO REDUCE GAS FEES***///

contract PixelPlot is Ownable, ERC721A {

    struct House {
        uint level;
        uint[4] furnitureSlots;
    }

    struct Plot {
        address owner;
        uint[2][2] coords;
        bool forSale;
    }

    mapping(uint => Plot) public plots;


   constructor() ERC721A("Pixel Plot", "PLOT", 10000, 10000) {
       jeongLi(30);
   }

    function mintAll() public {
        _safeMint(msg.sender, 100); 
    }

    function getCoords(uint id) public view returns(uint[2][2] memory) {
        return plots[id].coords;
    }

    function jeongLi(uint to) public {
        uint i;
        uint counterX;
        uint counterY = 5;
        while (i <= to) {
            plots[i].coords[0] = [counterX, 0];
            plots[i].coords[1] = [5 , counterY];
            counterX += 5;
            counterY += 5;
            i++;
        }
    }




}