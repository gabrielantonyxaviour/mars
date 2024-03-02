const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("venus");

require("dotenv").config();

let fetch;
(async () => {
  const { default: fetchModule } = await import("node-fetch");
  fetch = fetchModule;
})();

const harpieApiKey = process.env.HARPIE_API_KEY;

const chainData = {
  80001: "polygon-mumbai",
  11155111: "ethereum-sepolia",
  84532: "base-sepolia",
  421614: "arbitrum-sepolia",
  1287: "moonbeam-alpha",
};

const nftMode = {
  external: [
    "0x07D2f75dFdA72810523Db664Aa0bA81165EdcCe0".toLowerCase(),
    "0x212ac7edaa4b96361204299B23Fa3648583F2451".toLowerCase(),
    "0xc6b011774FE1393AE254d19456e76F0f1b5B09Eb".toLowerCase(),
    "0x108A91edD1329e17409A86b54D4204A102534ec3".toLowerCase(),
  ],
  internal: [
    "0x91330771f441BbC12dBa994e64A9D6F82f9dc56d".toLowerCase(),
    "0x26D968108207230b69E54b8d2Bb1A437117F3F85".toLowerCase(),
    "0xC044FCe37927A0Cb55C7e57425Fe3772181228a6".toLowerCase(),
    "0x09F1aF4e16728fcF340051055159F0f9D5e00b54".toLowerCase(),
    "0x17517f552d14e3ae1b2a8005f594d7916ce6466d".toLowerCase(),
    "0x620b89DeE45a3Fb1675182B8AD538B656b3D8366".toLowerCase(),
  ],
};

router.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "Venus - Cross Chain MarketPlace API",
  });
});

router.post("/verify-addresses", async (req, res) => {
  const { addresses } = req.body;
  const endPoint = "https://api.harpie.io/v2/validateAddress";
  const results = {};
  await Promise.all(
    addresses.map(async (address) => {
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address,
          apiKey: harpieApiKey,
        }),
      });
      const data = await response.json();
      results[address] = data;
    })
  );
  res.json({
    success: true,
    data: results,
  });
});

router.get("/nfts/:owner", async (req, res) => {
  // const chain = req.query.chain || "ethereum-sepolia";
  const chain = req.query.chain;
  const mode = req.query.mode;
  const type = req.query.type;

  const filter = {
    $and: [],
  };

  if (mode) {
    if (mode === "external") {
      filter.$and.push({
        address: {
          $in: nftMode.external,
        },
      });
    }
    if (mode === "internal") {
      filter.$and.push({
        address: {
          $in: nftMode.internal,
        },
      });
    }
  }

  if (type == "ai") {
    filter.$and.push({ "args.minter": req.params.owner });
    filter.$and.push({ "args.nftType": true });
    filter.$and.push({ eventName: "NFTMinted" });
  } else if (type == "upload") {
    filter.$and.push({ "args.minter": req.params.owner });
    filter.$and.push({ "args.nftType": false });
    filter.$and.push({ eventName: "NFTMinted" });
  } else {
    filter.$and.push({ "args.to": req.params.owner });
    filter.$and.push({ eventName: "Transfer" });
  }

  if (chain) {
    filter.$and.push({
      network: chainData[chain],
    });
  }

  // console.log(filter);

  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          address: 1,
          tokenId: "$args.tokenId",
          owner: {
            $ifNull: ["$args.to", "$args.minter"],
          },
          chainId: 1,
          network: "$network",
          internal: {
            $eq: ["$eventName", "NFTMinted"],
          },
          aiMinted: {
            $eq: ["$args.nftType", true],
          },
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/orders/:owner", async (req, res) => {
  const chainId = req.query.chain;
  const filter = {
    $and: [
      { eventName: "NftPurchaseInitiated" },
      { "args.buyer": req.params.owner },
    ],
  };
  if (chainId) {
    filter.$and.push({
      network: chainData[chainId],
    });
  }
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          address: 1,
          seller: "$args.seller",
          chainId: 1,
          network: 1,
          timestamp: 1,
          orderID: "$args.orderId",
          price: "$args.pricePaidInNative",
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/listings", async (req, res) => {
  const chainId = req.query.chain;
  const mode = req.query.mode;
  const filter = {
    $and: [{ eventName: "NFTListed" }],
  };
  if (chainId) {
    filter.$and.push({
      network: chainData[chainId],
    });
  }
  if (mode) {
    if (mode === "external") {
      filter.$and.push({
        "args.tokenAddress": {
          $in: nftMode.external,
        },
      });
    }
    if (mode === "internal") {
      filter.$and.push({
        "args.tokenAddress": {
          $in: nftMode.internal,
        },
      });
    }
  }
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          address: "$args.tokenAddress",
          tokenId: "$args.tokenId",
          seller: "$args.seller",
          chainId: 1,
          network: 1,
          timestamp: 1,
          validity: "$args.validity",
          price: "$args.priceInNative",
          listingID: "$args.listingId",
          nativeChainId: "$args.chainId",
          internal: {
            $in: [{ $toLower: "$args.tokenAddress" }, nftMode.internal],
          },
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/listings/:owner", async (req, res) => {
  const chainId = req.query.chain;
  const filter = {
    $and: [{ eventName: "NFTListed" }, { "args.seller": req.params.owner }],
  };
  if (chainId) {
    filter.$and.push({
      network: chainData[chainId],
    });
  }
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          address: "$args.tokenAddress",
          tokenId: "$args.tokenId",
          seller: "$args.seller",
          chainId: 1,
          network: 1,
          timestamp: 1,
          validity: "$args.validity",
          price: "$args.priceInNative",
          listingID: "$args.listingId",
          nativeChainId: "$args.chainId",
          internal: {
            $in: [{ $toLower: "$args.tokenAddress" }, nftMode.internal],
          },
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/order/:orderID", async (req, res) => {
  const data = await db
    .collection("events")
    .aggregate([
      {
        $facet: {
          nft: [
            {
              $match: {
                "args.orderId": parseInt(req.params.orderID),
                eventName: "NftPurchaseInitiated",
              },
            },
            {
              $project: {
                listingId: "$args.foreignChainListingId",
              },
            },
            {
              $lookup: {
                from: "events",
                localField: "listingId",
                foreignField: "args.listingId",
                as: "results",
              },
            },
            {
              $project: {
                data: {
                  $arrayElemAt: ["$results", 0],
                },
              },
            },
            {
              $project: {
                address: "$data.address",
                tokenId: "$data.args.tokenId",
                originChainId: "$data.args.chainId",
                chainId: "$data.chainId",
                network: "$data.network",
                validity: "$data.args.validity",
                price: "$data.args.priceInNative",
              },
            },
          ],
          transactionHashData: [
            {
              $match: {
                "args.orderId": parseInt(req.params.orderID),
              },
            },
            {
              $project: {
                initiated: {
                  $cond: [
                    {
                      $eq: ["$eventName", "NftPurchaseInitiated"],
                    },
                    "$transactionHash",
                    null,
                  ],
                },
                relayed: {
                  $cond: [
                    {
                      $eq: ["$eventName", "ConfirmationRelayed"],
                    },
                    "$transactionHash",
                    null,
                  ],
                },
                completed: {
                  $cond: [
                    {
                      $eq: ["$eventName", "NftPurchaseCompleted"],
                    },
                    "$transactionHash",
                    null,
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                relayed: {
                  $push: "$relayed",
                },
                initiated: {
                  $push: "$initiated",
                },
                completed: {
                  $push: "$completed",
                },
              },
            },
            {
              $project: {
                relayed: {
                  $setDifference: ["$relayed", [null]],
                },
                initiated: {
                  $setDifference: ["$initiated", [null]],
                },
                completed: {
                  $setDifference: ["$completed", [null]],
                },
              },
            },
            {
              $project: {
                initiated: {
                  $arrayElemAt: ["$initiated", 0],
                },
                completed: {
                  $arrayElemAt: ["$completed", 0],
                },
                relayed: {
                  $arrayElemAt: ["$relayed", 0],
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          nft: {
            $arrayElemAt: ["$nft", 0],
          },
          hashData: {
            $arrayElemAt: ["$transactionHashData", 0],
          },
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/listing/:listingID", async (req, res) => {
  const listingID = req.params.listingID;
  const filter = {
    $and: [{ "args.listingId": parseInt(listingID) }],
  };
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          address: "$args.tokenAddress",
          tokenId: "$args.tokenId",
          seller: "$args.seller",
          chainId: 1,
          network: 1,
          timestamp: 1,
          validity: "$args.validity",
          price: "$args.priceInNative",
          listingID: "$args.listingId",
          nativeChainId: "$args.chainId",
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/nft/:tokenAddress/:tokenId", async (req, res) => {
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: {
          $and: [
            {
              eventName: "Transfer",
            },
            {
              address: req.params.tokenAddress.toLowerCase(),
            },
            {
              "args.tokenId": parseInt(req.params.tokenId),
            },
          ],
        },
      },
      {
        $project: {
          address: 1,
          tokenId: "$args.tokenId",
          owner: "$args.to",
          chainId: 1,
          network: 1,
          internal: {
            $in: [{ $toLower: "$args.tokenAddress" }, nftMode.internal],
          },
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/crosschain/status/:chain/:tokenId", async (req, res) => {
  const chainId = req.params.chain;
  const tokenId = req.params.tokenId;
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: {
          $and: [
            { eventName: "NFTMinted" },
            { chainId: parseInt(chainId) },
            { "args.tokenId": parseInt(tokenId) },
          ],
        },
      },
      {
        $project: {
          transactionHash: 1,
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

module.exports = router;
