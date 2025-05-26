"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AirdropList } from "@/components/dashboard/airdrop-list"
import { WalletConnector } from "@/components/wallet-connector"
import { ChainSelector } from "@/components/chain-selector"
import { WalletInfo } from "@/components/wallet-info"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Settings, Bell, HelpCircle, Zap, Shield, TrendingUp } from "lucide-react"
import { TokenTransfer } from "@/components/dashboard/token-transfer"
import { TransferHistory } from "@/components/dashboard/transfer-history"

export default function Dashboard() {
  const { isConnected, address } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Mobile-Responsive Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm opacity-90" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm sm:text-base text-slate-400 hidden sm:block">Welcome back to MultiChain Protocol</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <div className="hidden sm:block">
              <ChainSelector />
            </div>
            <Button variant="outline" size="icon" className="border-slate-600 flex-shrink-0">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-slate-600 flex-shrink-0">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex-shrink-0">
              <WalletConnector />
            </div>
          </div>
        </header>

        {/* Mobile Chain Selector */}
        <div className="sm:hidden mb-6">
          <ChainSelector />
        </div>

        {/* Stats Cards */}
        <div className="mb-6 sm:mb-8">
          <StatsCards />
        </div>

        {/* Main Content - Mobile First Layout */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Airdrops List */}
            <AirdropList />

            {/* Transfer History - Show on mobile after airdrops */}
            <div className="lg:hidden">
              <TransferHistory />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Wallet Info */}
            <WalletInfo />

            {/* Token Transfer */}
            <TokenTransfer />

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base">
                  Claim All Available
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm sm:text-base"
                >
                  Migrate Tokens
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm sm:text-base"
                >
                  Swap Tokens
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm sm:text-base"
                >
                  View Portfolio
                </Button>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-green-500" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-slate-300">Wallet Connected</span>
                    <span className="text-green-400">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-slate-300">2FA Enabled</span>
                    <span className="text-yellow-400">⚠</span>
                  </div>
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-slate-300">Backup Created</span>
                    <span className="text-green-400">✓</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm sm:text-base"
                >
                  Security Settings
                </Button>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-4">Having issues with transactions, migrations, or claims?</p>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm sm:text-base"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transfer History - Desktop Only (Hidden on mobile, shown above) */}
        <div className="hidden lg:block mt-8">
          <TransferHistory />
        </div>

        {/* Analytics Section */}
        <div className="mt-6 sm:mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Portfolio Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 rounded-lg bg-slate-700/30">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">$12,345</div>
                  <div className="text-slate-400 text-sm sm:text-base">Total Portfolio Value</div>
                  <div className="text-green-400 text-xs sm:text-sm flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +12.5% this month
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/30">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">8</div>
                  <div className="text-slate-400 text-sm sm:text-base">Active Positions</div>
                  <div className="text-blue-400 text-xs sm:text-sm mt-1">Across 8 chains</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-slate-700/30 sm:col-span-2 lg:col-span-1">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">$2,456</div>
                  <div className="text-slate-400 text-sm sm:text-base">Total Rewards Claimed</div>
                  <div className="text-purple-400 text-xs sm:text-sm mt-1">15 airdrops claimed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
