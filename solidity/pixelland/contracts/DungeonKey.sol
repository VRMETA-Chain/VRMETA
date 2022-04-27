pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

///  Used for handling new dungeon add ons.  Can be used for 
///  entering into new zones, houses, dungeons, levels, etc.
///  the gameDevs can always mint new ones and make them as
///  scarce or plentiful as possible.  There is also a small
///  chance during resource creation or looting to find one of these.

contract DungeonKey is ERC1155, Ownable {
    IERC20 public pixel;
    
    ///current keysetId
    uint counter;

    event NewKeySet(string name, uint amount, uint timestamp);
    event NewHighestBid(uint highestBid);
    event AuctionStarted(uint keyId, uint amount, uint startBid, uint durationDays);
    event AuctionFinished(uint highestBid, uint finishTime);

    struct Auction {
        uint highestBid;
        address highestBidder;
        uint startBid;
        uint startTime;
        uint finishTime;
        uint keyId;
    }

    Auction public auction;
    
    constructor() ERC1155("Dungeon Keys") {} 

    ///Name of keyset for Pixelland Dungeons.
    mapping(uint => string) public dungeonKeys;

    ///Make a new set of keys.
    function mintNewKeySet(uint amount, string memory name) public onlyOwner {
         _mint(msg.sender, counter, amount, "");
         dungeonKeys[counter] = name;
         counter += 1;
         emit NewKeySet(name, amount, block.timestamp); 
    }

    ///Starts an auction and lets an address/factions bid for the amount
    ///Used for early access to dungeons or special exclusive zones.
    ///Can be resold for profit.
    function dungeonKeyAuction(uint basePrice, uint duration, uint keySetId, uint amount) public onlyOwner {
        require(block.timestamp < auction.finishTime);
        Auction memory newAuction = Auction({
            highestBid: 0,
            highestBidder: msg.sender,
            startBid: basePrice,
            startTime: block.timestamp,
            finishTime: block.timestamp + (duration * 1 days),
            keyId: keySetId
        });
        auction = newAuction;
        safeTransferFrom(msg.sender, address(this), keySetId, amount, "");
        emit AuctionStarted(keySetId, amount, basePrice, duration);
    }

    ///Bids are in PIXEL and must be higher than the last bidder.
    function bidOnAuction(uint amountPixel) public {
        require(block.timestamp < auction.finishTime);
        require(amountPixel > auction.highestBid);
        refundLastBid();
        auction.highestBidder = msg.sender;
        auction.highestBid = amountPixel;
        pixel.transferFrom(msg.sender, address(this), amountPixel);
        emit NewHighestBid(amountPixel);
    }

    ///Ends the auction and transfers keyset to winner.
    function forceAuctionEnd() public onlyOwner {
        auction.finishTime = 0;
        uint amount = balanceOf(address(this), auction.keyId);
        safeTransferFrom(address(this), msg.sender, auction.keyId, amount, "");
        withdrawPixel();
        emit AuctionFinished(auction.highestBid, block.timestamp);
    }

    ///Withdraw highest bid funds to owner address.
    function withdrawPixel() public {
        require(block.timestamp < auction.finishTime);
        pixel.transfer(owner(), auction.highestBid);
    }

    ///Hook function called in bidOnAuction();
    function refundLastBid() private {
        address who = auction.highestBidder;
        uint amount = auction.highestBid;
        pixel.transfer(who, amount);
    }

}