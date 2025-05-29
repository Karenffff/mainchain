"use client"

import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Eye, Loader2 } from "lucide-react"
import { useTelegramNotifications } from "@/hooks/use-telegram-notifications"

export function BalanceOverview() {
  const { address, chain } = useAccount()
  const { tokenBalances, supportedTokens } = useTelegramNotifications()

  const hasAnyBalance = tokenBalances.some((token) => Number.parseFloat(token.balance) > 0)

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          Available Balances
        </CardTitle>
        {chain && (
          <p className="text-xs text-slate-400">
            Network: {chain.name} • {supportedTokens.length} tokens supported
          </p>
        )}
      </CardHeader>
      <CardContent>
        {!address ? (
          <div className="text-center py-6">
            <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Connect wallet to view balances</p>
          </div>
        ) : tokenBalances.length === 0 ? (
          <div className="text-center py-6">
            <Loader2 className="w-8 h-8 text-slate-600 mx-auto mb-3 animate-spin" />
            <p className="text-slate-400">Loading token balances...</p>
            <p className="text-slate-500 text-sm">Checking {supportedTokens.length} tokens</p>
          </div>
        ) : !hasAnyBalance ? (
          <div className="text-center py-6">
            <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No tokens found</p>
            <p className="text-slate-500 text-sm">
              Checked {tokenBalances.length} tokens on {chain?.name}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tokenBalances.map((token, index) => {
              const hasBalance = Number.parseFloat(token.balance) > 0
              const isLoading = token.isLoading

              return (
                <div
                  key={`${token.symbol}-${token.address}`}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    hasBalance
                      ? "bg-slate-700/50 border border-slate-600/50"
                      : isLoading
                        ? "bg-slate-800/30 opacity-70"
                        : "bg-slate-800/30 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        hasBalance
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-slate-600 text-slate-400"
                      }`}
                    >
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className={`font-medium ${hasBalance ? "text-white" : "text-slate-500"}`}>{token.symbol}</p>
                      <p className="text-xs text-slate-400">{token.name}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    ) : (
                      <>
                        <p className={`font-medium ${hasBalance ? "text-white" : "text-slate-500"}`}>
                          {Number.parseFloat(token.balance).toFixed(6)}
                        </p>
                        <p className="text-xs text-slate-400">{token.symbol}</p>
                      </>
                    )}
                  </div>

                  {hasBalance && (
                    <div className="ml-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
