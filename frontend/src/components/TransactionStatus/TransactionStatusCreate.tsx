import React from "react";

export default function TransactionStatusCreate({
  status,
}: {
  status: string;
}) {
  return (
    <div>
      <h2>Transaction Status</h2>
      <p>{status}</p>
    </div>
  );
}

// Create
// Transaction to Moonbeam to Ethereum
// 1.5 hours

// Make contracts work by tonight
// 4 hours - Test Axelar, Wormhole

// Tomorrow - Indexer fetch data.
