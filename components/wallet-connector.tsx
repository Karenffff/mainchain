"use client"

import { useAccount, useDisconnect } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useTelegramNotifications } from "@/hooks/use-telegram-notifications"

export function WalletConnector() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Track redirects per connection
  const lastRedirectConnectionRef = useRef<string>("")
  const isFirstRenderRef = useRef(true)

  // Initialize Telegram notifications
  const { sendTransferNotification } = useTelegramNotifications()

  // Auto redirect to dashboard when wallet connects - but only for NEW connections
  useEffect(() => {
    // Skip on first render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }

    if (isConnected && address && chain) {
      const connectionKey = `${address}-${chain?.id}`

      // Only redirect if this is a new connection and we're on home page
      if (lastRedirectConnectionRef.current !== connectionKey && window.location.pathname === "/") {
        console.log("🔗 New wallet connection - redirecting to dashboard")
        lastRedirectConnectionRef.current = connectionKey
        router.push("/dashboard")
        toast.success("🎉 Welcome to your dashboard!")
      }
    }

    // Reset redirect tracking when wallet disconnects
    if (!isConnected) {
      lastRedirectConnectionRef.current = ""
    }
  }, [isConnected, address, chain, router]) // Updated dependency list

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard")
    }
  }

  const openBlockExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url || "https://etherscan.io"
      window.open(`${explorerUrl}/address/${address}`, "_blank")
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleDisconnect = () => {
    console.log("🔌 Disconnecting wallet...")
    lastRedirectConnectionRef.current = ""
    disconnect()
    toast.success("Wallet disconnected")
    if (window.location.pathname === "/dashboard") {
      router.push("/")
    }
  }

  if (isConnected && address) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700">
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">{formatAddress(address)}</span>
            <span className="sm:hidden">Wallet</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
          <div className="px-3 py-2 border-b border-slate-700">
            <p className="text-xs text-slate-400">Connected to</p>
            <p className="text-sm font-medium text-white">{chain?.name || "Unknown Network"}</p>
          </div>
          <DropdownMenuItem onClick={copyAddress} className="gap-2 text-slate-300 hover:bg-slate-700">
            <Copy className="w-4 h-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openBlockExplorer} className="gap-2 text-slate-300 hover:bg-slate-700">
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => open()} className="gap-2 text-slate-300 hover:bg-slate-700">
            <Wallet className="w-4 h-4" />
            Change Wallet
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDisconnect} className="gap-2 text-red-400 hover:bg-slate-700">
            <LogOut className="w-4 h-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      onClick={() => open()}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2 transition-all duration-200 hover:scale-105"
    >
      <Wallet className="w-4 h-4" />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </Button>
  )
}
