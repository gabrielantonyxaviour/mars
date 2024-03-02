const { createPublicClient, http, parseAbi } = require("viem");

require("dotenv").config();

const mumbaiClient = createPublicClient({
  transport: http(
    `https://lb.drpc.org/ogrpc?network=polygon-mumbai&dkey=${process.env.DRPC_API_KEY}`
  ),
});

const sepoliaClient = createPublicClient({
  transport: http(
    `https://lb.drpc.org/ogrpc?network=sepolia&dkey=${process.env.DRPC_API_KEY}`
  ),
});

const baseSepoliaClient = createPublicClient({
  transport: http(
    `https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=${process.env.DRPC_API_KEY}`
  ),
});

const arbitrumSepoliaClient = createPublicClient({
  transport: http(
    `https://lb.drpc.org/ogrpc?network=arbitrum-sepolia&dkey=${process.env.DRPC_API_KEY}`
  ),
});

const moonbeamAlphaClient = createPublicClient({
  transport: http(
    `https://lb.drpc.org/ogrpc?network=moonbase-alpha&dkey=${process.env.DRPC_API_KEY}`
  ),
});

module.exports = {
  mumbaiClient,
  sepoliaClient,
  baseSepoliaClient,
  arbitrumSepoliaClient,
  moonbeamAlphaClient,
};
