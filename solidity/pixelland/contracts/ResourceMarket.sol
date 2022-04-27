//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Pixel.sol";
import "./Resources.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract ResourceMarket is ERC1155Holder {

    address public owner;
    IERC20 public pixel;
    Resources public resources;

    ///Resource constants
    uint256 public constant WOOD = 0;
    uint256 public constant STONE = 1;
    uint256 public constant FOOD = 2;
    uint256 public constant HEALTH_POTIONS = 3;
    uint256 public constant STAMINA_POTIONS = 4;
    uint256 public constant SKELETON_BONES = 5;
    uint256 public constant DUAL_POTIONS = 6;

    mapping(address => uint) public pixelForBuyOrder;

    constructor(address _pixel, address _resources) {
        pixel = IERC20(_pixel);
        resources = Resources(_resources);
        owner = msg.sender;
    }

    struct SellOrder {
        uint item;
        uint amountToSell;
        uint pricePerItem;
        address merchant;
    }
    struct BuyOrder {
        uint item;
        uint amountToBuy;
        uint pricePerItem;
        address merchant;
    }

    BuyOrder [] public buyOrders; 
    SellOrder [] public sellOrders;

    ///@notice pushes a sell order and allocated resources to allow the contract to handle 
    ///token transfer on behalf of the merchant.
    function createSellOrder(uint _itemId, uint amount, uint pricePerItem) public {
        resources.safeTransferFrom(msg.sender, address(this), _itemId, amount, "");
        SellOrder memory order = SellOrder({
            item: _itemId, 
            amountToSell: amount,
            pricePerItem: pricePerItem,
            merchant: msg.sender
        });
        sellOrders.push(order);
    }

    ///@notice pushes a buy order and allocated PIXEL to allow the contract to handle 
    ///token transfer on behalf of the merchant.
    function createBuyOrder(uint _itemId, uint amount, uint pricePerItem) public {
        pixel.transferFrom(msg.sender, address(this), amount * pricePerItem);
        pixelForBuyOrder[msg.sender] == (amount * pricePerItem);
        BuyOrder memory order = BuyOrder({
            item: _itemId, 
            amountToBuy: amount,
            pricePerItem: pricePerItem,
            merchant: msg.sender
        });
        buyOrders.push(order);
    }

    ///@notice buyers can find the best deals.
    function getMinPriceSellOrder(uint _itemId) public view returns(uint) {
        uint index = findLowestPrice(_itemId);
        return index; 
    }

    ///@notice sellers can find the best deal for their goods.
    function getMaxPriceBuyOrder(uint _itemId) public view returns(uint) {
        uint index = findHighestPrice(_itemId);
        return index; 
    }

    function buyItemFromMerchant(uint index, uint _itemId, uint amount) public {
        require(sellOrders[index].item == _itemId, "Not selling that.");
        uint price = sellOrders[index].pricePerItem * amount;
        pixel.transferFrom(msg.sender, sellOrders[index].merchant, price);
        resources.safeTransferFrom(address(this), msg.sender, _itemId, amount, "");
        sellOrders[index].amountToSell -= amount;
        if (sellOrders[index].amountToSell == 0) {
                uint last = sellOrders.length - 1;
                sellOrders[0] = sellOrders[last];
                sellOrders.pop();
        }
    }
    function sellItemToMerchant(uint index, uint _itemId, uint amount) public {
        require(buyOrders[index].item == _itemId, "Not buying that.");
        uint price = buyOrders[index].pricePerItem * amount;
        pixel.transfer(msg.sender, price);
        resources.safeTransferFrom(msg.sender, buyOrders[index].merchant, _itemId, amount, "");
        buyOrders[index].amountToBuy -= amount;
        if (buyOrders[index].amountToBuy == 0) {
                uint last = buyOrders.length - 1;
                buyOrders[0] = buyOrders[last];
                buyOrders.pop();
        }
    }

    function findLowestPrice(uint _itemId) internal view returns(uint) {
       SellOrder memory sellorder;
       uint index;
       for(uint x=0; x < sellOrders.length; x++){
           if(sellOrders[x].item == _itemId) {
              if (sellOrders[x].pricePerItem < sellorder.pricePerItem) {
               sellorder = sellOrders[x];
               index = x;
           }
       }
           } 
           return index;
       }

    function findHighestPrice(uint _itemId) internal view returns(uint) {
       BuyOrder memory buyorder;
       uint index;
       for(uint x=0; x < buyOrders.length; x++){
           if(buyOrders[x].item == _itemId) {
              if (buyOrders[x].pricePerItem > buyorder.pricePerItem) {
               buyorder = buyOrders[x];
               index = x;
           }
       }
           }
           return index;
       }

}