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

// Optional: Define featured wallets to show at the top (recommended popular ones)
const featuredWalletIds = [
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
  "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Coinbase Wallet
  "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow
  "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927", // Ledger Live
  "225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f", // Safe
]

// Create modal with support for ALL available wallets (400+)
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
  
  // Keep featured wallets to show popular ones first
  featuredWalletIds,
  
  // REMOVED: includeWalletIds - this was limiting wallet selection
  // REMOVED: excludeWalletIds - this would exclude wallets
  
  // By not specifying includeWalletIds or excludeWalletIds, 
  // Web3Modal will show ALL available wallets (400+)
  
  // Additional configuration for enhanced wallet features
  enableWalletFeatures: true,
  enableSwaps: true,
  enableEmail: true, // Enable email login
  enableSocials: ["google", "github", "apple", "discord", "facebook", "twitter"], // Social logins
  
  // Optional: Additional configurations for better UX
  allWallets: "SHOW", // Explicitly show all wallets
  
  // Wallet grouping and search features
  enableWalletSearch: true, // Enable search functionality
  enableRecentWallets: true, // Show recently used wallets
})

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}