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

router.get("/listing", async (req, res) => {
  const data = await db.collection("events").find({}).toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/listing/chain/:chain", async (req, res) => {
  const data = await db
    .collection("events")
    .find({
      network: req.params.chain,
    })
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/listing/hash/:txHash", async (req, res) => {
  const data = await db
    .collection("events")
    .find({
      transactionHash: req.params.txHash,
    })
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/listing/address/:address", async (req, res) => {
  const data = await db
    .collection("events")
    .aggregate([
      {
        $group: {
          _id: {
            $arrayElemAt: ["$args", 1],
          },
          data: {
            $addToSet: "$$ROOT",
          },
        },
      },
      {
        $match: {
          _id: req.params.address,
        },
      },
    ])
    .toArray();
  res.json({
    success: true,
    data,
  });
});

router.get("/listing/collection/:address", async (req, res) => {
  const data = await db
    .collection("events")
    .aggregate([
      {
        $group: {
          _id: {
            $arrayElemAt: ["$args", 2],
          },
          data: {
            $addToSet: "$$ROOT",
          },
        },
      },
      {
        $match: {
          _id: req.params.address,
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
