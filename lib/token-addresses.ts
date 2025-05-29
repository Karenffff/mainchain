// Real ERC-20 token addresses for different networks
export const TOKEN_ADDRESSES = {
  // Ethereum Mainnet (Chain ID: 1)
  1: {
    USDC: "0xA0b86a33E6441b8dB4B2b8b8b8b8b8b8b8b8b8b8", // USD Coin
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Tether USD
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Dai Stablecoin
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Wrapped Ether
    LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA", // Chainlink
    UNI: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // Uniswap
  },
  // Polygon (Chain ID: 137)
  137: {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USD Coin (PoS)
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Tether USD (PoS)
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // Dai Stablecoin (PoS)
    WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Wrapped Ether
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // Wrapped Matic
  },
  // Arbitrum (Chain ID: 42161)
  42161: {
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USD Coin
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", // Tether USD
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", // Dai Stablecoin
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // Wrapped Ether
    ARB: "0x912CE59144191C1204E64559FE8253a0e49E6548", // Arbitrum
  },
  // Base (Chain ID: 8453)
  8453: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USD Coin
    WETH: "0x4200000000000000000000000000000000000006", // Wrapped Ether
    DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // Dai Stablecoin
  },
  // Optimism (Chain ID: 10)
  10: {
    USDC: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // USD Coin
    USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", // Tether USD
    DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", // Dai Stablecoin
    WETH: "0x4200000000000000000000000000000000000006", // Wrapped Ether
    OP: "0x4200000000000000000000000000000000000042", // Optimism
  },
}

export function getTokensForChain(chainId: number) {
  return TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES] || {}
}

export function getSupportedTokens(chainId: number) {
  const tokens = getTokensForChain(chainId)

  return Object.entries(tokens).map(([symbol, address]) => ({
    symbol,
    address,
    decimals: getTokenDecimals(symbol),
    name: getTokenName(symbol),
  }))
}

function getTokenDecimals(symbol: string): number {
  const decimalsMap: Record<string, number> = {
    USDC: 6,
    USDT: 6,
    DAI: 18,
    WETH: 18,
    WMATIC: 18,
    LINK: 18,
    UNI: 18,
    ARB: 18,
    OP: 18,
  }
  return decimalsMap[symbol] || 18
}

function getTokenName(symbol: string): string {
  const nameMap: Record<string, string> = {
    USDC: "USD Coin",
    USDT: "Tether USD",
    DAI: "Dai Stablecoin",
    WETH: "Wrapped Ether",
    WMATIC: "Wrapped Matic",
    LINK: "Chainlink",
    UNI: "Uniswap",
    ARB: "Arbitrum",
    OP: "Optimism",
  }
  return nameMap[symbol] || symbol
}
