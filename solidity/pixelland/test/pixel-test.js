const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Pixel", function () {
  it("Should return the total supply", async function () {
    const Pixel = await ethers.getContractFactory("Pixel");
    const pixel = await Pixel.deploy();
    await pixel.deployed();

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const totalSupply = (10 ** 9).toString();
    const ownerSupply = await pixel.balanceOf(owner.address);


    expect(await pixel.totalSupply()).to.equal(ownerSupply);

    const burnTx = await pixel.burn(pixel.totalSupply());

    // wait until the transaction is mined
    await burnTx.wait();

    expect(await pixel.totalSupply()).to.equal(0);
    expect(await pixel.balanceOf(owner.address)).to.equal(0);
  });
});
