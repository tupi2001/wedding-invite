"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { BirdsAnimation } from "./birds"

export function HeroSection({ isVisible }: { isVisible: boolean }) {
  const [showText, setShowText] = useState(false)
  const [showButterflies, setShowButterflies] = useState(false)

  useEffect(() => {
    if (!isVisible) return
    const textTimer = setTimeout(() => setShowText(true), 300)
    // Butterflies start immediately when page first loads
    const butterflyTimer = setTimeout(() => setShowButterflies(true), 800)
    return () => {
      clearTimeout(textTimer)
      clearTimeout(butterflyTimer)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute inset-0">
        <Image
          src="/ballroom_image.png"
          alt="Elegant wedding ballroom with crystal chandeliers and floral arrangements"
          fill
          className="object-cover"
          priority
        />
        {/* Strong dark gradient overlay for crisp white text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(to bottom,
                rgba(0,0,0,0.25) 0%,
                rgba(0,0,0,0.45) 30%,
                rgba(0,0,0,0.50) 50%,
                rgba(0,0,0,0.45) 70%,
                rgba(0,0,0,0.30) 85%,
                rgba(255,255,255,0.3) 100%
              )
            `,
          }}
        />
        {/* Additional center vignette for extra text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.2) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Butterflies animation */}
      <BirdsAnimation trigger={showButterflies} />

      {/* Hero Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Formal invitation wording */}
        <div
          className={`transition-all duration-1000 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p
            className="font-serif text-xs tracking-[0.3em] uppercase text-center"
            style={{
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {"Request the honour of your presence"}
          </p>
        </div>

        {/* Decorative line above names */}
        <div
          className={`mt-5 transition-all duration-1000 ${
            showText ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="w-20 h-px mx-auto" style={{ background: "rgba(255,255,255,0.5)" }} />
        </div>

        {/* Names */}
        <div
          className={`mt-5 transition-all duration-1200 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <h1 className="font-script text-center leading-tight text-balance">
            <span
              className="block text-7xl sm:text-8xl"
              style={{
                color: "#fff",
                textShadow: "0 3px 16px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)",
              }}
            >
              {"Nada"}
            </span>
            <span
              className="block text-4xl sm:text-5xl my-2"
              style={{
                color: "rgba(210,190,196,0.95)",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {"&"}
            </span>
            <span
              className="block text-7xl sm:text-8xl"
              style={{
                color: "#fff",
                textShadow: "0 3px 16px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)",
              }}
            >
              {"Karim"}
            </span>
          </h1>
        </div>

        {/* Decorative line below names */}
        <div
          className={`mt-5 transition-all duration-1000 ${
            showText ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="w-20 h-px mx-auto" style={{ background: "rgba(255,255,255,0.5)" }} />
        </div>

        {/* Date and time */}
        <div
          className={`mt-5 transition-all duration-1000 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <p
            className="font-serif text-lg tracking-[0.2em] text-center"
            style={{
              color: "#fff",
              textShadow: "0 2px 10px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {"Friday, 22nd May 2026"}
          </p>
          <p
            className="font-serif text-sm tracking-[0.25em] uppercase text-center mt-2"
            style={{
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 2px 10px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {"5:00 PM"}
          </p>
        </div>

        {/* Small floral divider */}
        <div
          className={`mt-8 flex items-center gap-3 transition-all duration-1000 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1200ms" }}
        >
          <div className="w-10 h-px" style={{ background: "rgba(255,255,255,0.4)" }} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx={8 + Math.cos((angle * Math.PI) / 180) * 3.5}
                cy={8 + Math.sin((angle * Math.PI) / 180) * 3.5}
                rx="2.5"
                ry="1.8"
                fill="rgba(255,255,255,0.5)"
                transform={`rotate(${angle} ${8 + Math.cos((angle * Math.PI) / 180) * 3.5} ${8 + Math.sin((angle * Math.PI) / 180) * 3.5})`}
              />
            ))}
            <circle cx="8" cy="8" r="1.5"             fill="rgba(210,190,196,0.7)" />
          </svg>
          <div className="w-10 h-px" style={{ background: "rgba(255,255,255,0.4)" }} />
        </div>

        {/* Scroll hint */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
            showText ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1800ms" }}
        >
          <div className="flex flex-col items-center gap-2">
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: "var(--font-sans)",
                textShadow: "0 1px 6px rgba(0,0,0,0.3)",
              }}
            >
              {"Scroll down"}
            </p>
            <div
              className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
              style={{ borderColor: "rgba(255,255,255,0.35)" }}
            >
              <div
                className="w-1 h-2 rounded-full animate-bounce"
                style={{ background: "rgba(255,255,255,0.5)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
