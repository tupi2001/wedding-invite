import React from "react"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Great_Vibes, Lato, Amiri, Tajawal } from "next/font/google"

import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-sans",
})

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic",
})

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-arabic-display",
})

export const metadata: Metadata = {
  title: {
    default: "Nada & Karim - Wedding Invitation",
    template: "%s | Nada & Karim Wedding",
  },
  description:
    "You are cordially invited to celebrate the wedding of Nada & Karim on May 22, 2026 at Al Masa Hotel, Cairo",
  keywords: ["wedding", "invitation", "Nada", "Karim", "Cairo", "Egypt"],
  authors: [{ name: "Nada & Karim" }],
  openGraph: {
    title: "Nada & Karim - Wedding Invitation",
    description:
      "You are cordially invited to celebrate the wedding of Nada & Karim on May 22, 2026",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_EG",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#c8a96e",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${greatVibes.variable} ${lato.variable} ${amiri.variable} ${tajawal.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
