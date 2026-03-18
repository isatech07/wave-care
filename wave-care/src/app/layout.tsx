import "./globals.css"

import { Suspense } from "react"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>
        <Suspense>
          <Navbar />
        </Suspense>
        {children}

        <Footer />

      </body>
    </html>
  )
}