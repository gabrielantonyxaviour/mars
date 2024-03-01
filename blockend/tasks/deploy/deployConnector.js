const { networks } = require("../../networks");

task("deploy-connector", "Deploys the VenusConnector contract")
  .addOptionalParam(
    "verify",
    "Set to true to verify contract",
    false,
    types.boolean
  )
  .setAction(async (taskArgs) => {
    console.log(`Deploying VenusConnector contract to ${network.name}`);

    console.log("\n__Compiling Contracts__");
    await run("compile");

    const relayer = networks[network.name].wormholeRelayer;
    const protocolAddress = networks.moonbaseAlpha.protocol;
    const protocolWormholeChainId = networks.moonbaseAlpha.wormholeChainId;
    const protcolAxelarAddress = "moonbeam-axelar";
    const connectorContractFactory = await ethers.getContractFactory(
      "VenusConnector"
    );
    const connectorContract = await connectorContractFactory.deploy(
      relayer,
      protocolAddress,
      protocolWormholeChainId,
      protcolAxelarAddress
    );

    console.log(
      `\nWaiting ${
        networks[network.name].confirmations
      } blocks for transaction ${
        connectorContract.deployTransaction.hash
      } to be confirmed...`
    );

    await connectorContract.deployTransaction.wait(
      networks[network.name].confirmations
    );

    console.log(
      "\nDeployed VenusConnector contract to:",
      connectorContract.address
    );

    if (network.name === "localFunctionsTestnet") {
      return;
    }

    const verifyContract = taskArgs.verify;
    if (
      network.name !== "localFunctionsTestnet" &&
      verifyContract &&
      !!networks[network.name].verifyApiKey &&
      networks[network.name].verifyApiKey !== "UNSET"
    ) {
      try {
        console.log("\nVerifying contract...");
        await run("verify:verify", {
          address: connectorContract.address,
          constructorArguments: [
            relayer,
            protocolAddress,
            protocolWormholeChainId,
            protcolAxelarAddress,
          ],
        });
        console.log("Contract verified");
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log(
            "Error verifying contract.  Ensure you are waiting for enough confirmation blocks, delete the build folder and try again."
          );
          console.log(error);
        } else {
          console.log("Contract already verified");
        }
      }
    } else if (verifyContract && network.name !== "localFunctionsTestnet") {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or FUJI_SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      );
    }

    console.log(
      `\n VenusConnector contract deployed to ${connectorContract.address} on ${network.name}`
    );
  });
