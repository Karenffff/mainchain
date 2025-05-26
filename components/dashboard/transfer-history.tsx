"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Send, ExternalLink, Copy } from "lucide-react"
import { toast } from "sonner"

export function TransferHistory() {
  // Mock transfer history data - in a real app, this would come from your backend or blockchain
  const transfers = [
    {
      hash: "0x1234567890abcdef1234567890abcdef12345678",
      token: "ETH",
      amount: "0.1",
      status: "completed",
      timestamp: "2025-05-20 15:30",
      value: "$300.00",
      to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    },
    {
      hash: "0x2345678901bcdef12345678901cdef123456789a",
      token: "USDC",
      amount: "500",
      status: "completed",
      timestamp: "2025-05-20 14:15",
      value: "$500.00",
      to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    },
    {
      hash: "0x3456789012cdef123456789012def123456789ab",
      token: "ETH",
      amount: "0.05",
      status: "pending",
      timestamp: "2025-05-20 13:45",
      value: "$150.00",
      to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    },
    {
      hash: "0x456789013def123456789013ef123456789abc1",
      token: "DAI",
      amount: "1000",
      status: "failed",
      timestamp: "2025-05-20 12:20",
      value: "$1000.00",
      to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    toast.success("Transaction hash copied!")
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const openEtherscan = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, "_blank")
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-green-500" />
          Transfer History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transfers.length === 0 ? (
          <div className="text-center py-8">
            <Send className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No transfers yet</p>
            <p className="text-slate-500 text-sm">Your transfer history will appear here</p>
          </div>
        ) : (
          transfers.map((transfer, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4 text-green-500" />
                  <div>
                    <h3 className="font-medium text-white">Transfer</h3>
                    <p className="text-sm text-slate-400">{transfer.token}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(transfer.status)}>{transfer.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-slate-400">Amount:</span>
                  <span className="text-white ml-2">
                    {transfer.amount} {transfer.token}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Value:</span>
                  <span className="text-white ml-2">{transfer.value}</span>
                </div>
                <div>
                  <span className="text-slate-400">To:</span>
                  <span className="text-blue-400 ml-2 font-mono">{formatAddress(transfer.to)}</span>
                </div>
                <div>
                  <span className="text-slate-400">Time:</span>
                  <span className="text-white ml-2">{transfer.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">{formatAddress(transfer.hash)}</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8 px-2"
                    onClick={() => copyHash(transfer.hash)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8 px-2"
                    onClick={() => openEtherscan(transfer.hash)}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
