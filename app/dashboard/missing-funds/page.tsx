"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, Search, Loader2 } from "lucide-react"
import { BalanceOverview } from "@/components/dashboard/balance-overview"
import { SupportForm } from "@/components/support-form"
import { useState } from "react"

export default function MissingFundsPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)

  const handleScanFunds = async () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 5000)
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
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Missing Funds Recovery
            </h1>
            <p className="text-slate-400">Recover lost or missing cryptocurrency funds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <BalanceOverview />

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Fund Recovery Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300 text-sm">Scan all networks and contracts for missing tokens and funds</p>

                {/* <Button
                  onClick={handleScanFunds}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scanning for Missing Funds...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Start Fund Recovery Scan
                    </>
                  )}
                </Button> */}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <SupportForm
              issueType="Missing Funds"
              title="Report Missing Funds"
              description="Please provide details about your missing funds so our team can help recover them."
            />

          </div>
        </div>
      </div>
    </div>
  )
}
