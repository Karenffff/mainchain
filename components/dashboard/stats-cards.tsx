"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, TrendingUp, Wallet, Gift } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Balance",
      value: "$12,345.67",
      change: "+12.5%",
      icon: Wallet,
      color: "text-green-500",
    },
    {
      title: "Pending Airdrops",
      value: "5",
      change: "+2 new",
      icon: Gift,
      color: "text-purple-500",
    },
    {
      title: "Claimed Rewards",
      value: "$2,456.78",
      change: "+8.2%",
      icon: Coins,
      color: "text-blue-500",
    },
    {
      title: "Portfolio Growth",
      value: "+24.5%",
      change: "This month",
      icon: TrendingUp,
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-slate-300 truncate pr-2">{stat.title}</CardTitle>
            <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${stat.color} flex-shrink-0`} />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-lg sm:text-2xl font-bold text-white truncate">{stat.value}</div>
            <p className={`text-xs ${stat.color} truncate`}>{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
