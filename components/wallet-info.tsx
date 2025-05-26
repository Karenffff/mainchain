"use client"

import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Shield, Zap } from "lucide-react"

export function WalletInfo() {
  const { address, isConnected, connector, chain } = useAccount()

  if (!isConnected || !address) {
    return null
  }

  const getWalletType = (connectorName?: string) => {
    if (!connectorName) return "Unknown"

    const walletTypes: Record<string, { type: string; icon: string; color: string }> = {
      MetaMask: { type: "Browser Extension", icon: "🦊", color: "text-orange-500" },
      "Coinbase Wallet": { type: "Mobile/Extension", icon: "🔵", color: "text-blue-500" },
      WalletConnect: { type: "Mobile Wallet", icon: "📱", color: "text-purple-500" },
      "Trust Wallet": { type: "Mobile Wallet", icon: "🛡️", color: "text-blue-600" },
      Rainbow: { type: "Mobile Wallet", icon: "🌈", color: "text-pink-500" },
      Ledger: { type: "Hardware Wallet", icon: "🔒", color: "text-green-500" },
      Safe: { type: "Multi-sig Wallet", icon: "🏦", color: "text-emerald-500" },
      Injected: { type: "Browser Wallet", icon: "🌐", color: "text-gray-500" },
    }

    return walletTypes[connectorName] || { type: "Web3 Wallet", icon: "💼", color: "text-slate-500" }
  }

  const walletInfo = getWalletType(connector?.name)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-500" />
          Wallet Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Wallet Type:</span>
          <Badge className="bg-slate-700 text-slate-300">
            <span className="mr-1">{walletInfo.icon}</span>
            {connector?.name || "Unknown"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Category:</span>
          <span className={`text-sm font-medium ${walletInfo.color}`}>{walletInfo.type}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Network:</span>
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">{chain?.name || "Unknown"}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Status:</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">Connected</span>
          </div>
        </div>

        {connector?.name === "Safe" && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Multi-signature Wallet</span>
            </div>
            <p className="text-emerald-300 text-xs mt-1">Enhanced security with multiple signers required</p>
          </div>
        )}

        {(connector?.name === "Ledger" || connector?.name?.includes("Hardware")) && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Hardware Wallet</span>
            </div>
            <p className="text-green-300 text-xs mt-1">Maximum security with offline key storage</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
