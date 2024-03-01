const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const contractABI = require("./data/abi.json");
const { ethers } = require("ethers");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("venus");

const morgan = require("morgan");
app.use(morgan("common"));

const api = require("./routes/api");
app.use("/api", api);


/* DRPC Providers Starts */
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
/* DRPC Providers Ends */

/* Custom Providers Starts */
const injectiveEvmProvider = new ethers.providers.JsonRpcProvider(
  "https://testnet.rpc.inevm.com/http"
);
const injectiveEvmContractAddress = process.env.INJECTIVE_EVM;
const zircuitProvider = new ethers.providers.JsonRpcProvider(
  "https://zircuit1.p2pify.com"
);
const zircuitContractAddress = process.env.ZIRCUIT_TESTNET;
/* Custom Providers Ends */

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
const injectiveEvmInstance = new ethers.Contract(
  injectiveEvmContractAddress,
  contractABI,
  injectiveEvmProvider
);
const zircuitInstance = new ethers.Contract(
  zircuitContractAddress,
  contractABI,
  zircuitProvider
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
  await db.collection("events").insertOne(data);
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
  await db.collection("events").insertOne(data);
  console.log("Arbitrum Sepolia:", data);
});

injectiveEvmInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "injective-evm",
  };
  await db.collection("events").insertOne(data);
  console.log("Injective EVM:", data);
});

zircuitInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "zircuit",
  };
  await db.collection("events").insertOne(data);
  console.log("Zircuit:", data);
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      connectorAddress: {
        ethereumSepolia: ethereumSepoliaContractAddress,
        polygonMumbai: polygonMumbaiContractAddress,
        lineaGoerli: lineaGoerliContractAddress,
        baseSepolia: baseSepoliaContractAddress,
        arbitrumSepolia: arbitrumSepoliaContractAddress,
        injectiveEvm: injectiveEvmContractAddress,
        zircuit: zircuitContractAddress
      },
    },
  });
});

app.listen(port, () => {
  client.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  console.log(`App listening at http://localhost:${port}`);
});
