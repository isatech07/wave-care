import "./globals.css"
import type { Metadata } from "next"
import { Suspense } from "react"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"

export const metadata: Metadata = {
  title: {
    default: "Wave Care",
    template: "%s – Wave Care",
  },
  description: "Cuidados com a pele para cada estação do ano.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        {children}

        <Footer />
      </body>
    </html>
  )
}