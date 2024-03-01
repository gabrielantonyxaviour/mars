const { networks } = require("../networks");
task("owner-of", "Gets owner of nft").setAction(async (taskArgs, hre) => {
  try {
    const tokenId = "0";
    const functionHash = ethers.utils.id("ownerOf(uint256)").slice(0, 10);
    console.log(functionHash);

    const encodedData = ethers.utils.defaultAbiCoder
      .encode(["uint256"], [tokenId])
      .slice(2);
    console.log(functionHash + encodedData);
  } catch (error) {
    console.log(error);
  }
});
