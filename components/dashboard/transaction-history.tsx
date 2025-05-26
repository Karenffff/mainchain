"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Repeat, History } from "lucide-react"

export function TransactionHistory() {
  const transactions = [
    {
      type: "claim",
      token: "PROTO",
      amount: "1,000",
      status: "completed",
      hash: "0x1234...5678",
      timestamp: "2025-05-20 14:30",
      value: "$450.00",
    },
    {
      type: "swap",
      token: "ETH → USDC",
      amount: "0.5",
      status: "completed",
      hash: "0x2345...6789",
      timestamp: "2025-05-19 10:15",
      value: "$1,200.00",
    },
    {
      type: "migration",
      token: "OLD → NEW",
      amount: "2,500",
      status: "pending",
      hash: "0x3456...7890",
      timestamp: "2025-05-18 16:45",
      value: "$750.00",
    },
    {
      type: "claim",
      token: "GOV",
      amount: "500",
      status: "failed",
      hash: "0x4567...8901",
      timestamp: "2025-05-17 09:20",
      value: "$125.00",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "claim":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />
      case "swap":
        return <Repeat className="w-4 h-4 text-blue-500" />
      case "migration":
        return <ArrowUpRight className="w-4 h-4 text-purple-500" />
      default:
        return <History className="w-4 h-4" />
    }
  }

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

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <History className="w-5 h-5 text-blue-500" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((tx, index) => (
          <div key={index} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {getTypeIcon(tx.type)}
                <div>
                  <h3 className="font-medium text-white capitalize">{tx.type}</h3>
                  <p className="text-sm text-slate-400">{tx.token}</p>
                </div>
              </div>
              <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Amount:</span>
                <span className="text-white ml-2">{tx.amount}</span>
              </div>
              <div>
                <span className="text-slate-400">Value:</span>
                <span className="text-white ml-2">{tx.value}</span>
              </div>
              <div>
                <span className="text-slate-400">Hash:</span>
                <span className="text-blue-400 ml-2 font-mono">{tx.hash}</span>
              </div>
              <div>
                <span className="text-slate-400">Time:</span>
                <span className="text-white ml-2">{tx.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
