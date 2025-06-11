"use client"

import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { WalletConnector } from "@/components/wallet-connector"
import { ChainSelector } from "@/components/chain-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Bell,
  ArrowRightLeft,
  Coins,
  Gift,
  LogIn,
  Tractor,
  AlertTriangle,
  DollarSign,
  AlertCircle,
  Zap,
  Shield,
  HelpCircle,
  ChevronRight,
  Smartphone,
  Monitor,
} from "lucide-react"

export default function Dashboard() {
  const { isConnected, address, connector } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  // Detect device type
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  // Main features from the original design
  const mainFeatures = [
    {
      title: "Migration",
      description: "For any issues with Migration of coins",
      action: "Fix Migration Issues",
      icon: ArrowRightLeft,
      color: "from-blue-600 to-cyan-600",
      route: "/dashboard/migration",
      priority: "high",
      status: "available",
    },
    {
      title: "Swap/Exchange",
      description: "For any issues with swapping/exchange of coins",
      action: "Fix Swap Issues",
      icon: Coins,
      color: "from-green-600 to-emerald-600",
      route: "/dashboard/swap",
      priority: "high",
      status: "available",
    },
    {
      title: "Claim Reward",
      description: "To Claim Reward click here",
      action: "Click here to Claim Reward",
      icon: Gift,
      color: "from-purple-600 to-pink-600",
      route: "/dashboard/claim-rewards",
      priority: "high",
      status: "available",
    },
    {
      title: "Login Issues",
      description: "If you have issues logging into your wallet",
      action: "Fix Login Issues",
      icon: LogIn,
      color: "from-orange-600 to-red-600",
      route: "/dashboard/login-issues",
      priority: "medium",
      status: "available",
    },
    {
      title: "Farm/Pool",
      description: "Issues with farming or liquidity pools",
      action: "Fix Farm/Pool Issues",
      icon: Tractor,
      color: "from-yellow-600 to-orange-600",
      route: "/dashboard/farm-pool",
      priority: "medium",
      status: "available",
    },
    {
      title: "Missing Funds/Irregular Token Balance",
      description: "Recover missing or lost funds",
      action: "Recover Funds",
      icon: AlertTriangle,
      color: "from-red-600 to-pink-600",
      route: "/dashboard/missing-funds",
      priority: "high",
      status: "available",
    },
    {
      title: "Exorbitant Gas Fees",
      description: "Reduce high gas fees and optimize transactions",
      action: "Optimize Gas Fees",
      icon: DollarSign,
      color: "from-indigo-600 to-purple-600",
      route: "/dashboard/gas-fees",
      priority: "medium",
      status: "available",
    },
    {
      title: "Transaction Error",
      description: "Do you have any issues with transactions?",
      action: "Fix Transaction Errors",
      icon: AlertCircle,
      color: "from-slate-600 to-gray-600",
      route: "/dashboard/transaction-errors",
      priority: "high",
      status: "available",
    },
  ]

  // Quick action features
  const quickActions = [
    {
      title: "Auto Transfer",
      description: "Transfer maximum amount with one click",
      icon: Zap,
      route: "/dashboard/auto-transfer",
      color: "bg-yellow-600",
    },
    {
      title: "Security Check",
      description: "Verify wallet security and permissions",
      icon: Shield,
      route: "/dashboard/security",
      color: "bg-green-600",
    },
    {
      title: "Support Center",
      description: "Get help with any blockchain issues",
      icon: HelpCircle,
      route: "/dashboard/support",
      color: "bg-blue-600",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm opacity-90" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">MultiChain Protocol</h1>
              <p className="text-sm sm:text-base text-slate-400">Fix any blockchain issue instantly</p>
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

        {/* Wallet Status */}
        <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile ? (
                <Smartphone className="w-5 h-5 text-blue-500" />
              ) : (
                <Monitor className="w-5 h-5 text-green-500" />
              )}
              <div>
                <p className="text-white font-medium">{connector?.name} Connected</p>
                <p className="text-slate-400 text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                onClick={() => router.push(action.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{action.title}</h3>
                      <p className="text-xs text-slate-400">{action.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Features */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Blockchain Issue Solutions</h2>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {mainFeatures.length} Solutions Available
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {mainFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
                onClick={() => router.push(feature.route)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {feature.title}
                        </h3>
                        <Badge className={getPriorityColor(feature.priority)}>{feature.priority} priority</Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{feature.description}</p>

                  <div className="flex items-center justify-between">
                    <Button
                      className={`bg-gradient-to-r ${feature.color} hover:opacity-90 text-white text-sm`}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(feature.route)
                      }}
                    >
                      {feature.action} →
                    </Button>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-400 text-xs">Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-500" />
              Need Additional Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">24/7 Support</h4>
                <p className="text-slate-400 text-sm mb-3">Get instant help with any blockchain issue</p>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => router.push("/dashboard/support")}
                >
                  Contact Support
                </Button>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">Video Tutorials</h4>
                <p className="text-slate-400 text-sm mb-3">Step-by-step guides for common issues</p>
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => router.push("/dashboard/tutorials")}
                >
                  Watch Tutorials
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">MultiChain Protocol • Solving blockchain issues since 2024</p>
          <p className="text-slate-500 text-xs mt-1">Trusted by 10,000+ users worldwide</p>
        </div>
      </div>
    </div>
  )
}
