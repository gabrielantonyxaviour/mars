const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const contractABI = require("./data/abi.json");
const { ethers } = require("ethers");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("venus");

let fetch;
(async () => {
  const { default: fetchModule } = await import("node-fetch");
  fetch = fetchModule;
})();

const morgan = require("morgan");
app.use(morgan("common"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const etherumSepoliaProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=sepolia&dkey=${process.env.DRPC_API_KEY}`
);
const ethereumSepoliaContractAddress = process.env.ETHERUM_SEPOLIA;
const polygonMumbaiProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=polygon-mumbai&dkey=${process.env.DRPC_API_KEY}`
);
const polygonMumbaiContractAddress = process.env.POLYGON_MUMBAI;
const lineaGoerliProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=linea-goerli&dkey=${process.env.DRPC_API_KEY}`
);
const lineaGoerliContractAddress = process.env.LINEA_GOERLI;
const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=${process.env.DRPC_API_KEY}`
);
const baseSepoliaContractAddress = process.env.BASE_SEPOLIA;
const arbitrumSepoliaProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=arbitrum-sepolia&dkey=${process.env.DRPC_API_KEY}`
);
const arbitrumSepoliaContractAddress = process.env.ARBITRUM_SEPOLIA;

const ethereumSepoliaInstance = new ethers.Contract(
  ethereumSepoliaContractAddress,
  contractABI,
  etherumSepoliaProvider
);
const polygonMumbaiInstance = new ethers.Contract(
  polygonMumbaiContractAddress,
  contractABI,
  polygonMumbaiProvider
);
const lineaGoerliInstance = new ethers.Contract(
  lineaGoerliContractAddress,
  contractABI,
  lineaGoerliProvider
);
const baseSepoliaInstance = new ethers.Contract(
  baseSepoliaContractAddress,
  contractABI,
  baseSepoliaProvider
);
const arbitrumSepoliaInstance = new ethers.Contract(
  arbitrumSepoliaContractAddress,
  contractABI,
  arbitrumSepoliaProvider
);

ethereumSepoliaInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "ethereum-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Ethereum Sepolia:", data);
});

polygonMumbaiInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "polygon-mumbai",
  };
  await db.collection("events").insertOne(data);
  console.log("Polygon Mumbai:", data);
});

lineaGoerliInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "linea-goerli",
  };
  console.log("Linea Goerli:", data);
});

baseSepoliaInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "base-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Base Sepolia:", data);
});

arbitrumSepoliaInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "arbitrum-sepolia",
  };
  console.log("Arbitrum Sepolia:", data);
});

const harpieApiKey = process.env.HARPIE_API_KEY;

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      connecterAddress: {
        ethereumSepolia: ethereumSepoliaContractAddress,
        polygonMumbai: polygonMumbaiContractAddress,
        lineaGoerli: lineaGoerliContractAddress,
        baseSepolia: baseSepoliaContractAddress,
        arbitrumSepolia: arbitrumSepoliaContractAddress,
      },
    },
  });
});

app.post("/verify-addresses", async (req, res) => {
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

app.listen(port, () => {
  client.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  console.log(`App listening at http://localhost:${port}`);
});
