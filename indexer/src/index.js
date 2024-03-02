const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectorABI = require("./data/connector.abi.json");
const nftABI = require("./data/nft.abi.json");
const venusABI = require("./data/venus.abi.json");
const venusNFTABI = require("./data/venusNFT.abi.json");
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
const ethereumSepoliaConnector = process.env.ETHERUM_SEPOLIA_CONNECTOR;
const ethereumSepoliaNFT = process.env.ETHERUM_SEPOLIA_NFT;
const polygonMumbaiProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=polygon-mumbai&dkey=${process.env.DRPC_API_KEY}`
);
const polygonMumbaiConnector = process.env.POLYGON_MUMBAI_CONNECTOR;
const polygonMumbaiNFT = process.env.POLYGON_MUMBAI_NFT;
const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=${process.env.DRPC_API_KEY}`
);
const baseSepoliaConnector = process.env.BASE_SEPOLIA_CONNECTOR;
const baseSepoliaNFT = process.env.BASE_SEPOLIA_NFT;
const arbitrumSepoliaProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=arbitrum-sepolia&dkey=${process.env.DRPC_API_KEY}`
);
const arbitrumSepoliaConnector = process.env.ARBITRUM_SEPOLIA_CONNECTOR;
const arbitrumSepoliaNFT = process.env.ARBITRUM_SEPOLIA_NFT;
const moonbeamAlphaProvider = new ethers.providers.JsonRpcProvider(
  `https://lb.drpc.org/ogrpc?network=moonbase-alpha&dkey=${process.env.DRPC_API_KEY}`
);
const venusProtocol = process.env.VENUS_PROTOCOL;
const venusNFT = process.env.VENUS_NFT;
/* DRPC Providers Ends */

const ethereumSepoliaConnectorInstance = new ethers.Contract(
  ethereumSepoliaConnector,
  connectorABI,
  etherumSepoliaProvider
);
const polygonMumbaiConnectorInstance = new ethers.Contract(
  polygonMumbaiConnector,
  connectorABI,
  polygonMumbaiProvider
);
const baseSepoliaConnectorInstance = new ethers.Contract(
  baseSepoliaConnector,
  connectorABI,
  baseSepoliaProvider
);
const arbitrumSepoliaConnectorInstance = new ethers.Contract(
  arbitrumSepoliaConnector,
  connectorABI,
  arbitrumSepoliaProvider
);

const ethereumSepoliaNFTInstance = new ethers.Contract(
  ethereumSepoliaNFT,
  nftABI,
  etherumSepoliaProvider
);
const polygonMumbaiNFTInstance = new ethers.Contract(
  polygonMumbaiNFT,
  nftABI,
  polygonMumbaiProvider
);
const baseSepoliaNFTInstance = new ethers.Contract(
  baseSepoliaNFT,
  nftABI,
  baseSepoliaProvider
);
const arbitrumSepoliaNFTInstance = new ethers.Contract(
  arbitrumSepoliaNFT,
  nftABI,
  arbitrumSepoliaProvider
);

const venusProtocolInstance = new ethers.Contract(
  venusProtocol,
  venusABI,
  moonbeamAlphaProvider
);
const venusNFTInstance = new ethers.Contract(
  venusNFT,
  venusNFTABI,
  moonbeamAlphaProvider
);

ethereumSepoliaConnectorInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "ethereum-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Ethereum Sepolia:", data);
});

polygonMumbaiConnectorInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "polygon-mumbai",
  };
  await db.collection("events").insertOne(data);
  console.log("Polygon Mumbai:", data);
});

baseSepoliaConnectorInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "base-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Base Sepolia:", data);
});

arbitrumSepoliaConnectorInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "arbitrum-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Arbitrum Sepolia:", data);
});

ethereumSepoliaNFTInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "ethereum-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Ethereum Sepolia NFT:", data);
});

polygonMumbaiNFTInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "polygon-mumbai",
  };
  await db.collection("events").insertOne(data);
  console.log("Polygon Mumbai NFT:", data);
});

baseSepoliaNFTInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "base-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Base Sepolia NFT:", data);
});

arbitrumSepoliaNFTInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "arbitrum-sepolia",
  };
  await db.collection("events").insertOne(data);
  console.log("Arbitrum Sepolia NFT:", data);
});

venusProtocolInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "moonbeam-alpha",
  };
  await db.collection("events").insertOne(data);
  console.log("Venus Protocol:", data);
});

venusNFTInstance.on("*", async (event) => {
  let data = {
    ...event,
    timestamp: Date.now(),
    network: "moonbeam-alpha",
  };
  await db.collection("events").insertOne(data);
  console.log("Venus NFT:", data);
});

const ethereumSepoliaContractAddress = {
  connector: ethereumSepoliaConnector,
  nft: ethereumSepoliaNFT,
};

const polygonMumbaiContractAddress = {
  connector: polygonMumbaiConnector,
  nft: polygonMumbaiNFT,
};

const baseSepoliaContractAddress = {
  connector: baseSepoliaConnector,
  nft: baseSepoliaNFT,
};

const arbitrumSepoliaContractAddress = {
  connector: arbitrumSepoliaConnector,
  nft: arbitrumSepoliaNFT,
};

const moonbeamAlphaContractAddress = {
  protocol: venusProtocol,
  nft: venusNFT,
};


app.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      ethereumSepoliaContractAddress,
      polygonMumbaiContractAddress,
      baseSepoliaContractAddress,
      arbitrumSepoliaContractAddress,
      moonbeamAlphaContractAddress,
    },
  });
});

app.listen(port, () => {
  client.connect().then(() => {
    console.log("Connected to MongoDB");
  });
  console.log(`App listening at http://localhost:${port}`);
});
