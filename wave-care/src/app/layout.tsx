import "./globals.css"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Inter, Cormorant_Garamond, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import { UserProvider } from "@/contexts/UserContext"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-cormorant'
});

const jost = Jost({
  subsets: ["latin"],
  variable: '--font-jost'
});

export const metadata: Metadata = {
  title: {
    default: "Wave Care",
    template: "%s – Wave Care",
  },
  description: "Cuidados com a pele para cada estação do ano.",
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body 
        className={`${inter.variable} ${cormorant.variable} ${jost.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <UserProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>

          {children}

          <Footer />
          <Analytics />
        </UserProvider>
      </body>
    </html>
  )
}