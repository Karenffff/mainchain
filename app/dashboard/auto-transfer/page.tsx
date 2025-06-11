"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap } from "lucide-react"
import { AutoTransfer } from "@/components/dashboard/auto-transfer"


export default function AutoTransferPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="border-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              Auto Transfer Center
            </h1>
            <p className="text-slate-400">Transfer maximum amounts with one click</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AutoTransfer />
          </div>

        </div>
      </div>
    </div>
  )
}
