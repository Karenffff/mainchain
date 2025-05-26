"use client"

import { useAccount, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { mainnet, polygon, arbitrum, optimism, base } from "wagmi/chains"
import { useWeb3Modal } from "@web3modal/wagmi/react"

const chains = [mainnet, polygon, arbitrum, optimism, base]

export function ChainSelector() {
  const { chain, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()
  const { open } = useWeb3Modal()

  if (!isConnected) {
    return (
      <Button
        variant="outline"
        className="gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700"
        onClick={() => open({ view: "Networks" })}
      >
        Select Chain
        <ChevronDown className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-slate-800/50 border-slate-600 hover:bg-slate-700">
          {chain?.name || "Select Chain"}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
        {chains.map((chainOption) => (
          <DropdownMenuItem
            key={chainOption.id}
            onClick={() => switchChain({ chainId: chainOption.id })}
            className="gap-2 text-slate-300 hover:bg-slate-700"
          >
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
            {chainOption.name}
            {chain?.id === chainOption.id && <span className="ml-auto text-green-400">✓</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => open({ view: "Networks" })}
          className="gap-2 text-blue-400 hover:bg-slate-700 border-t border-slate-700 mt-1 pt-2"
        >
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          More Networks...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
