"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Coins, AlertTriangle, Loader2 } from "lucide-react"
import { AutoTransfer } from "@/components/dashboard/auto-transfer"
import { SupportForm } from "@/components/support-form"
import { useState } from "react"

export default function SwapPage() {
  const router = useRouter()
  const [isFixing, setIsFixing] = useState(false)

  const handleFixSwap = async () => {
    setIsFixing(true)
    setTimeout(() => {
      setIsFixing(false)
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
              <Coins className="w-6 h-6 text-green-500" />
              Swap/Exchange Issues Fix
            </h1>
            <p className="text-slate-400">Resolve DEX and swap transaction problems</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Common Swap Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-medium mb-2">Failed Swaps</h4>
                  <p className="text-red-300 text-sm">Transactions failed but gas fees were charged</p>
                </div>
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">Slippage Issues</h4>
                  <p className="text-yellow-300 text-sm">High slippage causing unexpected token amounts</p>
                </div>
                <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-2">Stuck Approvals</h4>
                  <p className="text-blue-300 text-sm">Token approvals stuck or not working</p>
                </div>
              </CardContent>
            </Card>

            {/* <Button
              onClick={handleFixSwap}
              disabled={isFixing}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isFixing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fixing Swap Issues...
                </>
              ) : (
                "Start Swap Fix"
              )}
            </Button> */}
          </div>

          <div className="space-y-6">
            <SupportForm
              issueType="Swap/Exchange Issue"
              title="Describe Your Swap Issue"
              description="Please provide details about your swap problem so our team can assist you."
            />

          </div>
        </div>
      </div>
    </div>
  )
}
