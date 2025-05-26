"use client"

import { Button } from "@/components/ui/button"
import { WalletConnector } from "./wallet-connector"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { QuickTransferWidget } from "./dashboard/quick-transfer-widget"
import { toast } from "sonner"

export function HeroSection() {
  const { isConnected } = useAccount()
  const router = useRouter()

  const handleClaimAirdrop = () => {
    if (isConnected) {
      router.push("/dashboard")
    } else {
      toast.error("Please connect your wallet first")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-20 right-40 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm opacity-90" />
            </div>
          </div>
          <WalletConnector />
        </header>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            The MultiChain Protocol For DApp
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Synchronizer Panel is an open protocol to communicate securely between Wallets and Dapps on the blockchain
            (Web3 Apps).
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 items-center">
            {!isConnected && (
              <div className="flex justify-center">
                <WalletConnector />
              </div>
            )}
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 sm:px-8"
              onClick={handleClaimAirdrop}
            >
              {isConnected ? "Go to Dashboard" : "Claim Airdrop"}
            </Button>
          </div>
        </div>

        {/* Quick Transfer Widget - Only show when connected */}
        {isConnected && (
          <div className="max-w-md mx-auto mb-16">
            <QuickTransferWidget />
          </div>
        )}

        {/* Hero Illustration */}
        <div className="relative max-w-4xl mx-auto">
          <Image
            src="/images/hero-illustration.png"
            alt="MultiChain Protocol Illustration"
            width={800}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-16">
            Opening the doors of new world of Dapp experiences.
          </h2>

          <div className="space-y-6 sm:space-y-8">
            {[
              {
                title: "Migration",
                description: "For any issues with Migration of coins",
                action: "Fix Migration Issues",
              },
              {
                title: "Swap/Exchange",
                description: "For any issues with swapping/exchange of coins",
                action: "Fix Swap Issues",
              },
              {
                title: "Claim Reward",
                description: "to Claim Reward click here",
                action: "Click here to Claim Reward",
              },
              {
                title: "Login Issues",
                description: "if you have issues logging into your wallet.",
                action: "Fix",
              },
              {
                title: "Farm/Pool",
                description: "if you have issues logging into your wallet.",
                action: "Fix",
              },
              {
                title: "Missing Funds/Irregular token balance",
                description: "Recover missing or lost funds.",
                action: "Fix",
              },
              {
                title: "Exhorbitant Gas fees",
                description: "",
                action: "Fix",
              },
              {
                title: "Transaction Error",
                description: "Do you have any issues with transactions?",
                action: "Fix",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50"
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  {feature.description && (
                    <p className="text-slate-400 mb-4 text-sm sm:text-base">{feature.description}</p>
                  )}
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm sm:text-base"
                  >
                    {feature.action} →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
