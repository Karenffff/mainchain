import { type NextRequest, NextResponse } from "next/server"
import { createTelegramBot } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { address, token, amount, txHash, chainName, type } = body

    // Validate required fields
    if (!address || !token || !amount || !txHash || !chainName || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Telegram bot instance
    const bot = createTelegramBot()
    if (!bot) {
      return NextResponse.json({ error: "Telegram bot not configured" }, { status: 500 })
    }

    // Send notification
    const success = await bot.sendTransferNotification({
      address,
      token,
      amount,
      txHash,
      chainName,
      type,
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

    if (!success) {
      return NextResponse.json({ error: "Failed to send Telegram notification" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Transfer notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
