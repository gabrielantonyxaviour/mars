const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("venus");

const morgan = require("morgan");
app.use(morgan("common"));

const api = require("./routes/api");
app.use("/api", api);

const {
  mumbaiClient,
  sepoliaClient,
  baseSepoliaClient,
  arbitrumSepoliaClient,
  moonbeamAlphaClient,
} = require("./clients");
const { parseAbi } = require("viem");
const connectorABI = require("./data/connector.abi.json");
const nftABI = require("./data/nft.abi.json");
const venusABI = require("./data/venus.abi.json");
const venusNFTABI = require("./data/venusNFT.abi.json");

/* Viem Implementation */

let mumbaiContracts = [
  {
    address: process.env.POLYGON_MUMBAI_CONNECTOR,
    abi: connectorABI,
    block: process.env.POLYGON_MUMBAI_CONNECTOR_BLOCK,
  },
  {
    address: process.env.POLYGON_MUMBAI_NFT,
    abi: nftABI,
    block: process.env.POLYGON_MUMBAI_NFT_BLOCK,
  },
  {
    address: process.env.POLYGON_MUMBAI_CROSSCHAIN_NFT,
    abi: nftABI,
    block: process.env.POLYGON_MUMBAI_CROSSCHAIN_NFT_BLOCK,
  },
];

let sepoliaContracts = [
  {
    address: process.env.ETHERUM_SEPOLIA_CONNECTOR,
    abi: connectorABI,
    block: process.env.ETHERUM_SEPOLIA_CONNECTOR_BLOCK,
  },
  {
    address: process.env.ETHERUM_SEPOLIA_NFT,
    abi: nftABI,
    block: process.env.ETHERUM_SEPOLIA_NFT_BLOCK,
  },
  {
    address: process.env.ETHERUM_SEPOLIA_CROSSCHAIN_NFT,
    abi: nftABI,
    block: process.env.ETHERUM_SEPOLIA_CROSSCHAIN_NFT_BLOCK,
  },
];

let baseSepoliaContracts = [
  {
    address: process.env.BASE_SEPOLIA_CONNECTOR,
    abi: connectorABI,
    block: process.env.BASE_SEPOLIA_CONNECTOR_BLOCK,
  },
  {
    address: process.env.BASE_SEPOLIA_NFT,
    abi: nftABI,
    block: process.env.BASE_SEPOLIA_NFT_BLOCK,
  },
  {
    address: process.env.BASE_SEPOLIA_CROSSCHAIN_NFT,
    abi: nftABI,
    block: process.env.BASE_SEPOLIA_CROSSCHAIN_NFT_BLOCK,
  },
];

let arbitrumSepoliaContracts = [
  {
    address: process.env.ARBITRUM_SEPOLIA_CONNECTOR,
    abi: connectorABI,
    block: process.env.ARBITRUM_SEPOLIA_CONNECTOR_BLOCK,
  },
  {
    address: process.env.ARBITRUM_SEPOLIA_NFT,
    abi: nftABI,
    block: process.env.ARBITRUM_SEPOLIA_NFT_BLOCK,
  },
  {
    address: process.env.ARBITRUM_SEPOLIA_CROSSCHAIN_NFT,
    abi: nftABI,
    block: process.env.ARBITRUM_SEPOLIA_CROSSCHAIN_NFT_BLOCK,
  },
];

let moonbeamAlphaContracts = [
  {
    address: process.env.VENUS_PROTOCOL,
    abi: venusABI,
    block: process.env.VENUS_PROTOCOL_BLOCK,
  },
  {
    address: process.env.VENUS_NFT,
    abi: venusNFTABI,
    block: process.env.VENUS_NFT_BLOCK,
  },
  {
    address: process.env.MOONBASE_NFT,
    abi: nftABI,
    block: process.env.MOONBASE_NFT_BLOCK,
  },
];

function convertSolidityAbiToHumanReadable(abi) {
  try {
    let abiHumanReadable = [];
    abi.map((item) => {
      if (item.type === "event") {
        const indexedParams = item.inputs
          .map(
            (param) =>
              `${param.type} ${param.indexed ? "indexed " : ""}${param.name}`
          )
          .join(", ");
        abiHumanReadable.push(`${item.type} ${item.name}(${indexedParams})`);
      }
    });

    return abiHumanReadable;
  } catch (error) {
    console.error(
      "Error converting Solidity ABI to human-readable ABI:",
      error.message
    );
    return null;
  }
}

async function scrapeMumabiData() {
  for (let i = 0; i < mumbaiContracts.length; i++) {
    const contract = mumbaiContracts[i];
    const latestBlock = await mumbaiClient.getBlockNumber();

    // Calculate the initial range for the first 700 blocks
    let startBlock = parseInt(contract.block, 10);
    let endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));

    while (startBlock <= latestBlock) {
      console.log(
        `Scraping from ${startBlock} to ${endBlock} for contract ${contract.address}`
      );
      const logs = await mumbaiClient.getLogs({
        address: contract.address,
        events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
        fromBlock: BigInt(startBlock),
        toBlock: BigInt(endBlock),
      });

      for (let j = 0; j < logs.length; j++) {
        const log = logs[j];
        const data = {
          ...log,
          timestamp: Date.now(),
          chainId: 80001,
          network: "polygon-mumbai",
        };
        await db.collection("events").insertOne(data);
      }

      // Move to the next range of 700 blocks
      startBlock = endBlock + 1;
      endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));
    }

    contract.block = endBlock;
  }
}

async function scrapeSepoliaData() {
  for (let i = 0; i < sepoliaContracts.length; i++) {
    const contract = sepoliaContracts[i];
    const latestBlock = await sepoliaClient.getBlockNumber();

    // Calculate the initial range for the first 700 blocks
    let startBlock = parseInt(contract.block, 10);
    let endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));

    while (startBlock <= latestBlock) {
      console.log(
        `Scraping from ${startBlock} to ${endBlock} for contract ${contract.address}`
      );

      const logs = await sepoliaClient.getLogs({
        address: contract.address,
        events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
        fromBlock: BigInt(startBlock),
        toBlock: BigInt(endBlock),
      });

      for (let j = 0; j < logs.length; j++) {
        const log = logs[j];
        const data = {
          ...log,
          timestamp: Date.now(),
          chainId: 11155111,
          network: "ethereum-sepolia",
        };
        await db.collection("events").insertOne(data);
      }

      // Move to the next range of 700 blocks
      startBlock = endBlock + 1;
      endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));
    }

    contract.block = endBlock;
  }
}

async function scrapeBaseSepoliaData() {
  for (let i = 0; i < baseSepoliaContracts.length; i++) {
    const contract = baseSepoliaContracts[i];
    const latestBlock = await baseSepoliaClient.getBlockNumber();

    // Calculate the initial range for the first 700 blocks
    let startBlock = parseInt(contract.block, 10);
    let endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));

    while (startBlock <= latestBlock) {
      console.log(
        `Scraping from ${startBlock} to ${endBlock} for contract ${contract.address}`
      );

      const logs = await baseSepoliaClient.getLogs({
        address: contract.address,
        events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
        fromBlock: BigInt(startBlock),
        toBlock: BigInt(endBlock),
      });

      for (let j = 0; j < logs.length; j++) {
        const log = logs[j];
        const data = {
          ...log,
          timestamp: Date.now(),
          chainId: 84532,
          network: "base-sepolia",
        };
        await db.collection("events").insertOne(data);
      }

      // Move to the next range of 700 blocks
      startBlock = endBlock + 1;
      endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));
    }

    contract.block = endBlock;
  }
}

async function scrapeArbitrumSepoliaData() {
  for (let i = 0; i < arbitrumSepoliaContracts.length; i++) {
    const contract = arbitrumSepoliaContracts[i];
    const latestBlock = await arbitrumSepoliaClient.getBlockNumber();

    // Calculate the initial range for the first 700 blocks
    let startBlock = parseInt(contract.block, 10);
    let endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));

    while (startBlock <= latestBlock) {
      console.log(
        `Scraping from ${startBlock} to ${endBlock} for contract ${contract.address}`
      );

      const logs = await arbitrumSepoliaClient.getLogs({
        address: contract.address,
        events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
        fromBlock: BigInt(startBlock),
        toBlock: BigInt(endBlock),
      });

      for (let j = 0; j < logs.length; j++) {
        const log = logs[j];
        const data = {
          ...log,
          timestamp: Date.now(),
          chainId: 421614,
          network: "arbitrum-sepolia",
        };
        await db.collection("events").insertOne(data);
      }

      // Move to the next range of 700 blocks
      startBlock = endBlock + 1;
      endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));
    }

    contract.block = endBlock;
  }
}

async function scrapeMoonbeamAlphaData() {
  for (let i = 0; i < moonbeamAlphaContracts.length; i++) {
    const contract = moonbeamAlphaContracts[i];
    const latestBlock = await moonbeamAlphaClient.getBlockNumber();

    // Calculate the initial range for the first 700 blocks
    let startBlock = parseInt(contract.block, 10);
    let endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));

    while (startBlock <= latestBlock) {
      console.log(
        `Scraping from ${startBlock} to ${endBlock} for contract ${contract.address}`
      );

      const logs = await moonbeamAlphaClient.getLogs({
        address: contract.address,
        events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
        fromBlock: BigInt(startBlock),
        toBlock: BigInt(endBlock),
      });

      for (let j = 0; j < logs.length; j++) {
        const log = logs[j];
        const data = {
          ...log,
          timestamp: Date.now(),
          chainId: 1287,
          network: "moonbeam-alpha",
        };

        await db.collection("events").insertOne(data);
      }

      // Move to the next range of 700 blocks
      startBlock = endBlock + 1;
      endBlock = Math.min(parseInt(startBlock + 700), parseInt(latestBlock));
    }

    contract.block = endBlock;
  }
}

const watchContracts = () => {
  for (let i = 0; i < mumbaiContracts.length; i++) {
    const contract = mumbaiContracts[i];
    console.log(`Watching contract ${contract.address}`);
    mumbaiClient.watchEvent({
      address: contract.address,
      events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
      onLogs: async (logs) => {
        for (let j = 0; j < logs.length; j++) {
          const log = logs[j];
          const data = {
            ...log,
            timestamp: Date.now(),
            chainId: 80001,
            network: "polygon-mumbai",
          };
          await db.collection("events").insertOne(data);
        }
      },
    });
  }

  for (let i = 0; i < sepoliaContracts.length; i++) {
    const contract = sepoliaContracts[i];
    console.log(`Watching contract ${contract.address}`);
    sepoliaClient.watchEvent({
      address: contract.address,
      events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
      onLogs: async (logs) => {
        for (let j = 0; j < logs.length; j++) {
          const log = logs[j];
          const data = {
            ...log,
            timestamp: Date.now(),
            chainId: 11155111,
            network: "ethereum-sepolia",
          };
          await db.collection("events").insertOne(data);
        }
      },
    });
  }

  for (let i = 0; i < baseSepoliaContracts.length; i++) {
    const contract = baseSepoliaContracts[i];
    console.log(`Watching contract ${contract.address}`);
    baseSepoliaClient.watchEvent({
      address: contract.address,
      events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
      onLogs: async (logs) => {
        for (let j = 0; j < logs.length; j++) {
          const log = logs[j];
          const data = {
            ...log,
            timestamp: Date.now(),
            chainId: 84532,
            network: "base-sepolia",
          };
          await db.collection("events").insertOne(data);
        }
      },
    });
  }

  for (let i = 0; i < arbitrumSepoliaContracts.length; i++) {
    const contract = arbitrumSepoliaContracts[i];
    console.log(`Watching contract ${contract.address}`);
    arbitrumSepoliaClient.watchEvent({
      address: contract.address,
      events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
      onLogs: async (logs) => {
        for (let j = 0; j < logs.length; j++) {
          const log = logs[j];
          const data = {
            ...log,
            timestamp: Date.now(),
            chainId: 421614,
            network: "arbitrum-sepolia",
          };
          await db.collection("events").insertOne(data);
        }
      },
    });
  }

  for (let i = 0; i < moonbeamAlphaContracts.length; i++) {
    const contract = moonbeamAlphaContracts[i];
    console.log(`Watching contract ${contract.address}`);
    moonbeamAlphaClient.watchEvent({
      address: contract.address,
      events: parseAbi(convertSolidityAbiToHumanReadable(contract.abi)),
      onLogs: async (logs) => {
        for (let j = 0; j < logs.length; j++) {
          const log = logs[j];
          const data = {
            ...log,
            timestamp: Date.now(),
            chainId: 1287,
            network: "moonbeam-alpha",
          };
          await db.collection("events").insertOne(data);
        }
      },
    });
  }
};

const main = async () => {
  await scrapeMumabiData();
  console.log("Scraped Mumbai Data");
  await scrapeSepoliaData();
  console.log("Scraped Sepolia Data");
  await scrapeBaseSepoliaData();
  console.log("Scraped Base Sepolia Data");
  await scrapeArbitrumSepoliaData();
  console.log("Scraped Arbitrum Sepolia Data");
  await scrapeMoonbeamAlphaData();
  console.log("Scraped Moonbeam Alpha Data");
  console.log("Watching Contracts...");
  watchContracts();
};

/* Viem Implementation Ends */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DRPC Indexer",
  });
});

app.listen(port, () => {
  client.connect().then(() => {
    console.log("Connected to MongoDB");
    // main();
  });
  console.log(`App listening at http://localhost:${port}`);
});
