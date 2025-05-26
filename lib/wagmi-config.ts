import { createConfig, http } from "wagmi"
import { mainnet, polygon, arbitrum, optimism, base, bsc, avalanche, fantom } from "wagmi/chains"
import { walletConnect, metaMask, coinbaseWallet, injected, safe } from "wagmi/connectors"

const projectId = "99efe00e94c2a44237612a360e065681"

if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined")
}

export const config = createConfig({
  chains: [
    mainnet,
    polygon,
    arbitrum,
    optimism,
    base,
    bsc, // Binance Smart Chain
    avalanche, // Avalanche
    fantom, // Fantom
  ],
  connectors: [
    injected(),
    walletConnect({
      projectId,
      metadata: {
        name: "MultiChain Protocol",
        description: "The MultiChain Protocol For DApp - Synchronizer Panel",
        url: typeof window !== "undefined" ? window.location.origin : "https://multichain-protocol.vercel.app",
        icons: [
          typeof window !== "undefined"
            ? `${window.location.origin}/favicon.ico`
            : "https://multichain-protocol.vercel.app/favicon.ico",
        ],
      },
      showQrModal: false, // Let Web3Modal handle the QR modal
    }),
    metaMask({
      dappMetadata: {
        name: "MultiChain Protocol",
        url: typeof window !== "undefined" ? window.location.origin : "https://multichain-protocol.vercel.app",
      },
    }),
    coinbaseWallet({
      appName: "MultiChain Protocol",
      appLogoUrl:
        typeof window !== "undefined"
          ? `${window.location.origin}/favicon.ico`
          : "https://multichain-protocol.vercel.app/favicon.ico",
    }),
    safe({
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      debug: false,
    }),
  ],
  transports: {
    [mainnet.id]: http("https://rpc.ankr.com/eth"),
    [polygon.id]: http("https://rpc.ankr.com/polygon"),
    [arbitrum.id]: http("https://rpc.ankr.com/arbitrum"),
    [optimism.id]: http("https://rpc.ankr.com/optimism"),
    [base.id]: http("https://mainnet.base.org"),
    [bsc.id]: http("https://bsc-dataseed.binance.org"),
    [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
    [fantom.id]: http("https://rpc.ankr.com/fantom"),
  },
})
