/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle missing optional dependencies
    config.externals = config.externals || []
    
    if (isServer) {
      // Add fallbacks for optional pino dependencies
      config.externals.push({
        'pino-pretty': 'pino-pretty',
        'lokijs': 'lokijs',
        'encoding': 'encoding'
      })
    }

    // Ignore optional pino dependencies that might not be installed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
      'lokijs': false,
      'encoding': false,
      'supports-color': false
    }

    return config
  },
  
  // Suppress warnings for optional dependencies
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty']
  },

  // Handle ESM modules
  transpilePackages: ['@web3modal/wagmi', '@web3modal/ui'],
  
  // Optimize for production
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: ['placeholder.svg'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
