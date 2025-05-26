import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3ModalProvider } from "@/components/web3modal-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MultiChain Protocol - The Future of DApp Experiences",
  description:
    "Synchronizer Panel is an open protocol to communicate securely between Wallets and Dapps on the blockchain.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ModalProvider>
          {children}
          <Toaster theme="dark" />
        </Web3ModalProvider>
      </body>
    </html>
  )
}
