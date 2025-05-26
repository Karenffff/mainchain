import { createWeb3Modal } from "@web3modal/wagmi/react"
import { config } from "./wagmi-config"

const projectId = "99efe00e94c2a44237612a360e065681" // Replace with your actual project ID

// Create modal
export const web3modal = createWeb3Modal({
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
  },
})
