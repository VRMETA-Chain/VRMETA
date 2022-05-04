//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Pixel.sol";

contract Resources is ERC1155 {
    Pixel public pixel;

    uint256 public constant WOOD = 0;
    uint256 public constant STONE = 1;
    uint256 public constant FOOD = 2;
    uint256 public constant HEALTH_POTIONS = 3;
    uint256 public constant STAMINA_POTIONS = 4;
    uint256 public constant SKELETON_BONES = 5;
    uint256 public constant DUAL_POTIONS = 6;
    uint256 public constant METAL = 7;
    uint256 public constant GEMS = 8;
    uint256 public constant DIAMOND_RINGS = 9;




    constructor(address _pixel) ERC1155("Pixelland Resources") {
        _mint(msg.sender, WOOD, 10**12, "");
        _mint(msg.sender, STONE, 10**6, "");
        _mint(msg.sender, FOOD, 10**10, "");
        _mint(msg.sender, HEALTH_POTIONS, 10**5, "");
        _mint(msg.sender, STAMINA_POTIONS, 10**5, "");
        _mint(msg.sender, SKELETON_BONES, 10**9, "");
        _mint(msg.sender, METAL, 10**4, "");
        pixel = Pixel(_pixel);
    }

    function chopWood(uint amount) public {
        _mint(msg.sender, WOOD, amount, "");
    }
    function mineStone(uint amount) public {
        _mint(msg.sender, STONE, amount, "");
    }
    function harvestFood(uint amount) public {
        _mint(msg.sender, FOOD, amount, "");
    }
    function lootSkeleton(uint amount) public {
        _mint(msg.sender, SKELETON_BONES, amount, ""); 
    }

    ///Health Potion = 10 food, 5 stone
    function makeHealthPotion(uint amount) public {
        uint amountFood = amount * 10;
        uint amountStone = amount * 5;
        _burn(msg.sender, FOOD, amountFood);
        _burn(msg.sender, STONE, amountStone);
        _mint(msg.sender, HEALTH_POTIONS, amount, "");
    }

    ///Stamina Potion = 10 food, 5 wood
    function makeStaminaPotion(uint amount) public {
        uint amountFood = amount * 10;
        uint amountWood = amount * 5;
        _burn(msg.sender, FOOD, amountFood);
        _burn(msg.sender, STONE, amountWood);
        _mint(msg.sender, STAMINA_POTIONS, amount, "");
    }

    ///Health + Stamina potion = 10 Food, 10 Wood, 5 Skeleton Bones
    function makeDualPotion(uint amount) public {
        uint amountFood = amount * 10;
        uint amountWood = amount * 10;
        uint amountBones = amount * 5;
        _burn(msg.sender, FOOD, amountFood);
        _burn(msg.sender, WOOD, amountWood);
        _burn(msg.sender, SKELETON_BONES, amountBones);
        _mint(msg.sender, DUAL_POTIONS, amount, "");
    }

    ///50 Stone
    ///50 Wood
    function makeMetal(uint amount) public {
        uint amountWood = amount * 50;
        uint amountStone = amount * 50;
        _burn(msg.sender, WOOD, amountWood);
        _burn(msg.sender, STONE, amountStone);
        _mint(msg.sender, METAL, amount, "");
    }

    ///50 Metal
    ///100 Stone
    ///2000 Pixel
    function makeGem(uint amount) public {
        uint amountMetal = amount * 50;
        uint amountStone = amount * 100;
        uint amountPixel = amount * 2000;
        _burn(msg.sender, STONE, amountStone);
        _burn(msg.sender, METAL, amountMetal);
        pixel.transferFrom(msg.sender, pixel.owner(), amountPixel);
        _mint(msg.sender, GEMS, amount, "");
    }

    ///100 Metal
    ///5 Gems
    ///10_000 Pixel
    function makeDiamondRing(uint amount) public {
        uint amountMetal = amount * 100;
        uint amountGems = amount * 5;
        uint amountPixel = amount * 10000;
        _burn(msg.sender, GEMS, amountGems);
        _burn(msg.sender, METAL, amountMetal);
        pixel.transferFrom(msg.sender, pixel.owner(), amountPixel);
        _mint(msg.sender, DIAMOND_RINGS, amount, "");
    }
}
