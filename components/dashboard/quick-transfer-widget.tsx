"use client"

import { useState } from "react"
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Loader2, Zap } from "lucide-react"
import { toast } from "sonner"

// Hardcoded destination wallet
const DESTINATION_WALLET = "0x566A1613668eFF73baBb9D6D1cF6aea77eea43a7"

export function QuickTransferWidget() {
  const { address, isConnected } = useAccount()
  const [isTransferring, setIsTransferring] = useState(false)

  const { sendTransaction, data: hash } = useSendTransaction()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash,
  })

  const handleQuickTransfer = async (amount: string) => {
    if (!isConnected || !address) {
      toast.error("Please connect your wallet")
      return
    }

    setIsTransferring(true)
    try {
      await sendTransaction({
        to: DESTINATION_WALLET,
        value: parseEther(amount),
      })
      toast.success(`Transferring ${amount} ETH...`)
    } catch (error) {
      console.error("Transfer failed:", error)
      toast.error("Transfer failed. Please try again.")
    } finally {
      setIsTransferring(false)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Transfer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-slate-400 text-sm">Send ETH instantly with one click</p>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => handleQuickTransfer("0.01")}
            disabled={isTransferring || isConfirming}
          >
            {isTransferring || isConfirming ? <Loader2 className="w-3 h-3 animate-spin" /> : "0.01 ETH"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => handleQuickTransfer("0.1")}
            disabled={isTransferring || isConfirming}
          >
            {isTransferring || isConfirming ? <Loader2 className="w-3 h-3 animate-spin" /> : "0.1 ETH"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => handleQuickTransfer("0.5")}
            disabled={isTransferring || isConfirming}
          >
            {isTransferring || isConfirming ? <Loader2 className="w-3 h-3 animate-spin" /> : "0.5 ETH"}
          </Button>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          onClick={() => handleQuickTransfer("1.0")}
          disabled={isTransferring || isConfirming}
        >
          {isTransferring || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Transferring...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send 1.0 ETH
            </>
          )}
        </Button>

        {hash && (
          <div className="text-xs text-slate-400 font-mono">
            Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
