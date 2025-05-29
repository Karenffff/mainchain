import { type NextRequest, NextResponse } from "next/server"
import { createTelegramBot } from "@/lib/telegram"

export async function GET(request: NextRequest) {
  try {
    const bot = createTelegramBot()
    if (!bot) {
      return NextResponse.json({ error: "Telegram bot not configured" }, { status: 500 })
    }

    const isConnected = await bot.testConnection()

    if (isConnected) {
      // Send test message
      await bot.sendWalletConnectionNotification({
        address: "0x1234567890123456789012345678901234567890",
        chainName: "Ethereum Mainnet",
        chainId: 1,
        nativeBalance: "1.234567",
        nativeSymbol: "ETH",
        tokens: [
          {
            symbol: "USDC",
            balance: "1000.50",
            name: "USD Coin",
            address: "0xA0b86a33E6441b8dB4B2b8b8b8b8b8b8b8b8b8b8",
          },
          {
            symbol: "USDT",
            balance: "500.25",
            name: "Tether USD",
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          },
        ],
        timestamp:
          new Date().toLocaleString("en-US", {
            timeZone: "UTC",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) + " UTC",
      })
    }

    return NextResponse.json({
      connected: isConnected,
      message: isConnected ? "Test notification sent!" : "Bot connection failed",
    })
  } catch (error) {
    console.error("Telegram test error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
