"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Tractor, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { AutoTransfer } from "@/components/dashboard/auto-transfer"
import { SupportForm } from "@/components/support-form"
import { useState } from "react"

export default function FarmPoolPage() {
  const router = useRouter()
  const [isFixing, setIsFixing] = useState(false)

  const handleFixFarmPool = async () => {
    setIsFixing(true)
    // Simulate fixing process
    setTimeout(() => {
      setIsFixing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="border-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Tractor className="w-6 h-6 text-yellow-500" />
              Farm/Pool Issues Fix
            </h1>
            <p className="text-slate-400">Resolve farming, staking, and liquidity pool problems</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Common Farm/Pool Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-medium mb-2">Staking Failures</h4>
                  <p className="text-red-300 text-sm">Unable to stake tokens or deposit into farms</p>
                </div>
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">Reward Claiming</h4>
                  <p className="text-yellow-300 text-sm">Problems with harvesting or claiming rewards</p>
                </div>
                <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-2">Liquidity Provision</h4>
                  <p className="text-blue-300 text-sm">Issues with adding or removing liquidity</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">How We Fix It</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">Resolve contract interaction issues</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">Fix approval problems</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">Recover stuck tokens in farms</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">Optimize gas for farming transactions</span>
                </div>
              </CardContent>
            </Card>

            {/* <Button
              onClick={handleFixFarmPool}
              disabled={isFixing}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              {isFixing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fixing Farm/Pool Issues...
                </>
              ) : (
                "Start Farm/Pool Fix"
              )}
            </Button> */}
          </div>

          {/* Support Form */}
          <div className="space-y-6">
            <SupportForm
              issueType="Farm/Pool Issue"
              title="Describe Your Farm/Pool Issue"
              description="Please provide details about your farming or liquidity pool problem so our team can assist you."
            />

          </div>
        </div>
      </div>
    </div>
  )
}
