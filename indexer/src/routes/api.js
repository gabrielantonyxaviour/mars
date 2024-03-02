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
  }

  if (chain) {
    filter.$and.push({
      network: chainData[chain],
    });
  }

  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
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
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/order/:orderID", async (req, res) => {
  const orderID = req.params.orderID;
  const filter = {
    $and: [{ "args.orderId": orderID }],
  };
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
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
    $and: [{ "args.listingId": listingID }],
  };
  const data = await db
    .collection("events")
    .aggregate([
      {
        $match: filter,
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
              eventName: 'Transfer'
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
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

module.exports = router;
