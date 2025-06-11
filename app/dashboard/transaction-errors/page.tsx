"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { AutoTransfer } from "@/components/dashboard/auto-transfer"
import { SupportForm } from "@/components/support-form"
import { useState } from "react"

export default function TransactionErrorsPage() {
  const router = useRouter()
  const [isFixing, setIsFixing] = useState(false)

  const handleFixTransactions = async () => {
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
              <AlertCircle className="w-6 h-6 text-slate-400" />
              Transaction Error Fix
            </h1>
            <p className="text-slate-400">Resolve blockchain transaction failures and errors</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Common Transaction Errors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-medium mb-2">Failed Transactions</h4>
                  <p className="text-red-300 text-sm">Transactions that fail with error messages</p>
                </div>
                <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <h4 className="text-yellow-400 font-medium mb-2">Pending Transactions</h4>
                  <p className="text-yellow-300 text-sm">Transactions stuck in pending state</p>
                </div>
                <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <h4 className="text-blue-400 font-medium mb-2">Nonce Issues</h4>
                  <p className="text-blue-300 text-sm">Transaction nonce too high or too low</p>
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
                  <span className="text-slate-300">Decode transaction error messages</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">Speed up or cancel pending transactions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">Fix nonce issues and reset transaction queue</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-300">Recover funds from failed transactions</span>
                </div>
              </CardContent>
            </Card>
{/* 
            <Button
              onClick={handleFixTransactions}
              disabled={isFixing}
              className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
            >
              {isFixing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fixing Transaction Errors...
                </>
              ) : (
                "Start Transaction Fix"
              )}
            </Button> */}
          </div>

          {/* Support Form */}
          <div className="space-y-6">
            <SupportForm
              issueType="Transaction Error"
              title="Describe Your Transaction Error"
              description="Please provide details about your transaction problem so our team can assist you."
            />

          </div>
        </div>
      </div>
    </div>
  )
}
