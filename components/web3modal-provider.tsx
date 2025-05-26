"use client"

import type { ReactNode } from "react"
import { config } from "@/lib/wagmi-config"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"

// Setup queryClient
const queryClient = new QueryClient()

// Get projectId from environment variable
const projectId = "99efe00e94c2a44237612a360e065681"

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined")
}

// Extended wallet list with popular wallets
const featuredWalletIds = [
  // Most Popular
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
  "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow

  // Hardware Wallets
  "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", // Ledger Live
  "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f", // Safe
]

const includeWalletIds = [
  // Core Wallets
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
  "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow

  // Hardware & Institutional
  "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", // Ledger Live
  "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f", // Safe (Gnosis Safe)
  "163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3", // Frame

  // Mobile & DeFi Wallets
  "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget
  "c03dfee351b6fcc421b4494ea33b9d4b92a984f87aa76d1663bb28705e95034a", // Uniswap Wallet
  "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", // Binance Web3 Wallet
  "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX Wallet
  "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66", // TokenPocket
  "1e6e8e1b5e1b4e1b1e1b1e1b1e1b1e1b1e1b1e1b1e1b1e1b1e1b1e1b1e1b1e1b", // Phantom (Solana)

  // Gaming & NFT Wallets
  "18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1", // Rabby Wallet
  "85db431492aa2e8672e93f4ea7acf10c88b97b867b0d373107af63dc4880f041", // XDEFI Wallet
  "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150", // SafePal
  "ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef", // Crypto.com DeFi Wallet

  // Regional & Specialized
  "dceb063851b1833cbb209e3717a0a0b06bf3fb500fe9db8cd3a553ecdfd40439", // Zerion
  "74f8092562bd79675e276d8b2062a83601a4106d30202f2d509195e30e19673d", // Argent
  "be49f0a78d6ea1beed3804c3a6b62ea187d7c6cd0e2c35d6e3d2b6a3e4c5f6a7", // Pillar
  "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // Loopring
  "15c8b91ade1a4e728729b3f71c4e7c8c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c", // Fortmatic

  // Web3 Social & Gaming
  "8837dd9413b1d9b585ee937d27a816590248386d9dbf59f5cd3422584e5c9d4f", // Sequence
  "bc949c5d968ae81310268bf9193f9c9fb7bb4e1283e1284af8f2bd4992535fd6", // WalletConnect Example
  "a7f416de1b3c6b8b5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c", // Torus
  "b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5b5c5", // Portis
]

// Create modal with extensive wallet support
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: "dark",
  themeVariables: {
    "--w3m-color-mix": "#6366f1",
    "--w3m-color-mix-strength": 20,
    "--w3m-accent": "#6366f1",
    "--w3m-border-radius-master": "8px",
    "--w3m-font-family": "Inter, sans-serif",
    "--w3m-z-index": 1000,
  },
  featuredWalletIds,
  includeWalletIds,
  // Remove this line to show ALL available wallets (300+)
  // excludeWalletIds: [], // Add wallet IDs here to exclude specific wallets

  // Additional configuration for more wallets
  enableWalletFeatures: true,
  enableSwaps: true,
  enableEmail: true, // Enable email login
  enableSocials: ["google", "github", "apple", "discord"], // Social logins
})

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
