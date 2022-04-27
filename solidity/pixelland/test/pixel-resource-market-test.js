const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("ResourceMarket", function () {

  beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Pixel = await ethers.getContractFactory("Pixel");
        Resources = await ethers.getContractFactory("Resources");
        ResourceMarket = await ethers.getContractFactory("ResourceMarket");
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    
        pixel = await Pixel.deploy();
        resources = await Resources.deploy(pixel.address);
        resourceMarket = await ResourceMarket.deploy(pixel.address, resources.address);

        await pixel.transfer(addr1.address,1000);

        
    });

  it("Should deploy", async function () {
    const master = await resourceMarket.owner();

    expect(master).to.equal(owner.address);

  });

  it("Should Receive Resources for Sale", async function () {
    await resources.setApprovalForAll(resourceMarket.address, true);
    
    const WOOD_ID = 0;
    await resourceMarket.createSellOrder(WOOD_ID, 10, 1);
    const woodBalance = await resources.balanceOf(resourceMarket.address, WOOD_ID);

    expect(woodBalance).to.equal(10);
  });

  it("Should Receive Pixel for Buying", async function () {
    await pixel.approve(resourceMarket.address, pixel.balanceOf(owner.address));

    const WOOD_ID = 0;
    ///amount = 10, price per item = 1.  Send 10 PIXEL for Quota.
    await resourceMarket.createBuyOrder(WOOD_ID, 10, 1);
    const pixelBalance = await pixel.balanceOf(resourceMarket.address);

    expect(pixelBalance).to.equal(10);
  });

  it("Should let someone buy from a Sell Order", async function () {
    await pixel.approve(resourceMarket.address, pixel.balanceOf(owner.address));
    await resources.setApprovalForAll(resourceMarket.address, true);
    const WOOD_ID = 0;
    await resourceMarket.createSellOrder(WOOD_ID, 10, 1);
    const woodBalance = await resources.balanceOf(resourceMarket.address, WOOD_ID);
    expect(woodBalance).to.equal(10);

    await pixel.connect(addr1).approve(resourceMarket.address, pixel.balanceOf(owner.address));
    const lowestPriceOrder = await resourceMarket.connect(addr1).getMinPriceSellOrder(WOOD_ID);
    await resourceMarket.connect(addr1).buyItemFromMerchant(lowestPriceOrder, WOOD_ID, 5);
    const woodBalanceAfter = await resources.balanceOf(resourceMarket.address, WOOD_ID);
    const woodBought = await resources.balanceOf(addr1.address, WOOD_ID);

    expect(woodBalanceAfter).to.equal(5);
    expect(woodBought).to.equal(5);
  });

  it("Should let someone sell to a Buy Order", async function () {
    await pixel.connect(addr1).approve(resourceMarket.address, pixel.balanceOf(owner.address));

    const preWoodBalance = await resources.balanceOf(owner.address, 0);

    const WOOD_ID = 0;
    await resourceMarket.connect(addr1).createBuyOrder(WOOD_ID, 60, 1);
   

    await resources.connect(owner).setApprovalForAll(resourceMarket.address, true);
    const highestPriceOrder = await resourceMarket.getMaxPriceBuyOrder(WOOD_ID);
    await resourceMarket.connect(owner).sellItemToMerchant(highestPriceOrder, WOOD_ID, 60);

    const woodBalanceAfterSelling = await resources.balanceOf(addr1.address, WOOD_ID);
    const woodBalance = await resources.balanceOf(owner.address, WOOD_ID);


    expect(woodBalance).to.equal(preWoodBalance - 60);
    expect(woodBalanceAfterSelling).to.equal(60);
  });

  it("Should let someone craft potions with resources", async function () {
    const FOOD_ID = 2;
    const STONE_ID = 1;
    const HEALTH_POTION = 3;
    const preFoodBalance = await resources.balanceOf(owner.address, FOOD_ID);
    const preStoneBalance = await resources.balanceOf(owner.address, STONE_ID);
    const preHP = await resources.balanceOf(owner.address, HEALTH_POTION);

    //One health potion = 10 food, 5 stone;
    await resources.makeHealthPotion(1);
 
    const postFoodBalance = await resources.balanceOf(owner.address, FOOD_ID);
    const postStoneBalance = await resources.balanceOf(owner.address, STONE_ID);
    const postHP = await resources.balanceOf(owner.address, HEALTH_POTION);
    const result = postHP - preHP;


    expect(postFoodBalance).to.equal(preFoodBalance - 10);
    expect(postStoneBalance).to.equal(preStoneBalance - 5);
    expect(result).to.equal(1);
  });


});