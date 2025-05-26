"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Clock, CheckCircle } from "lucide-react"

export function AirdropList() {
  const airdrops = [
    {
      name: "Protocol Token",
      symbol: "PROTO",
      amount: "1,000",
      status: "available",
      deadline: "2025-06-15",
      description: "Early adopter reward for MultiChain Protocol users",
    },
    {
      name: "Governance Token",
      symbol: "GOV",
      amount: "500",
      status: "pending",
      deadline: "2025-06-20",
      description: "Participate in protocol governance",
    },
    {
      name: "Utility Token",
      symbol: "UTIL",
      amount: "2,500",
      status: "claimed",
      deadline: "2025-05-30",
      description: "Platform utility and fee reduction token",
    },
    {
      name: "Staking Rewards",
      symbol: "STAKE",
      amount: "750",
      status: "available",
      deadline: "2025-07-01",
      description: "Rewards for active protocol participation",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Gift className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "claimed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Gift className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "claimed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-500" />
          Available Airdrops
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {airdrops.map((airdrop, index) => (
          <div key={index} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(airdrop.status)}
                <div>
                  <h3 className="font-semibold text-white">{airdrop.name}</h3>
                  <p className="text-sm text-slate-400">{airdrop.symbol}</p>
                </div>
              </div>
              <Badge className={getStatusColor(airdrop.status)}>{airdrop.status}</Badge>
            </div>

            <p className="text-sm text-slate-300 mb-3">{airdrop.description}</p>

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Amount:{" "}
                <span className="text-white font-medium">
                  {airdrop.amount} {airdrop.symbol}
                </span>
              </div>
              <div className="text-sm text-slate-400">
                Deadline: <span className="text-white">{airdrop.deadline}</span>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {airdrop.status === "available" && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Claim Now
                </Button>
              )}
              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
