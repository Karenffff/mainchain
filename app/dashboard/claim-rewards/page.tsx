"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Gift, Loader2 } from "lucide-react"
import { AutoTransfer } from "@/components/dashboard/auto-transfer"
import { AirdropList } from "@/components/dashboard/airdrop-list"
import { useState } from "react"

export default function ClaimRewardsPage() {
  const router = useRouter()
  const [isClaiming, setIsClaiming] = useState(false)

  const handleClaimRewards = async () => {
    setIsClaiming(true)
    setTimeout(() => {
      setIsClaiming(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="border-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Gift className="w-6 h-6 text-purple-500" />
              Claim Rewards & Airdrops
            </h1>
            <p className="text-slate-400">Claim all available rewards and airdrops</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AirdropList />

            <Button
              onClick={handleClaimRewards}
              disabled={isClaiming}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming All Rewards...
                </>
              ) : (
                "Claim All Available Rewards"
              )}
            </Button>
          </div>

          <div>
            <AutoTransfer />
          </div>
        </div>
      </div>
    </div>
  )
}
