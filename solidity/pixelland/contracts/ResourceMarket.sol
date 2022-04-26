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
    function getMinPriceSellOrder(uint _itemId) public view returns(SellOrder memory) {
        uint index = findLowestPrice(_itemId);
        return sellOrders[index]; 
    }

    ///@notice sellers can find the best deal for their goods.
    function getMaxPriceBuyOrder(uint _itemId) public view returns(BuyOrder memory) {
        uint index = findHighestPrice(_itemId);
        return buyOrders[index]; 
    }

    function buyItemFromMerchant(SellOrder memory sellorder, uint _itemId, uint amount) public {
        require(sellorder.item == _itemId, "Not selling that.");
        uint price = sellorder.pricePerItem * amount;
        pixel.transferFrom(msg.sender, sellorder.merchant, price);
        resources.safeTransferFrom(address(this), msg.sender, _itemId, amount, "");
        sellorder.amountToSell -= amount;
    }
    function sellItemToMerchant(BuyOrder memory buyorder, uint _itemId, uint amount) public {
        require(buyorder.item == _itemId, "Not buying that.");
        uint price = buyorder.pricePerItem * amount;
        pixel.transfer(msg.sender, price);
        resources.safeTransferFrom(msg.sender, buyorder.merchant, _itemId, amount, "");
        buyorder.amountToBuy -= amount;
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
