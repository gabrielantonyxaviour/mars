"use client";
import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  arbitrumSepolia,
  baseSepolia,
  lineaTestnet,
  moonbaseAlpha,
  polygonMumbai,
  sepolia,
} from "viem/chains";
import { injectiveEvmTestnet, zircuitTestnet } from "@/utils/chains";

const { chains, publicClient } = configureChains(
  [
    moonbaseAlpha,

    sepolia,
    baseSepolia,
    arbitrumSepolia,
    polygonMumbai,

    lineaTestnet,
    injectiveEvmTestnet,
    zircuitTestnet,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Mars",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
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
    </WagmiConfig>
  );
}
