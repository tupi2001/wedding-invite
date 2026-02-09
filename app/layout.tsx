import React from "react"
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Great_Vibes, Lato } from 'next/font/google'

import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Nada & Karim - Wedding Invitation',
  description: 'You are invited to celebrate the wedding of Nada & Karim - May 22, 2026',
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${greatVibes.variable} ${lato.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
