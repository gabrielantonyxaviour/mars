"use client";
import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  arbitrumSepolia,
  baseSepolia,
  moonbaseAlpha,
  polygonMumbai,
  sepolia,
} from "viem/chains";

const config = getDefaultConfig({
  appName: "Venus Marketplace",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [arbitrumSepolia, baseSepolia, moonbaseAlpha, polygonMumbai, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider
        initialChain={moonbaseAlpha}
        showRecentTransactions={true}
        theme={darkTheme({
          accentColor: "#00A0BD",
          accentColorForeground: "white",

          borderRadius: "large",
          fontStack: "rounded",
          overlayBlur: "small",
        })}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
