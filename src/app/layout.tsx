import "./globals.css";
import { Cormorant_Garamond, Inter, Alex_Brush } from "next/font/google";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const wedding = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-wedding",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serif.variable} ${sans.variable} ${wedding.variable}`}>
        {children}
      </body>
    </html>
  );
}
