"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { BirdsAnimation } from "./birds"
import { GoldParticles } from "./gold-particles"
import { ArabesqueFrame } from "./arabesque-frame"
import { useLanguage } from "@/context/language-context"
import { weddingConfig } from "@/config/wedding"

export function HeroSection({ isVisible }: { isVisible: boolean }) {
  const [showText, setShowText] = useState(false)
  const [showButterflies, setShowButterflies] = useState(false)
  const { t, lang } = useLanguage()

  useEffect(() => {
    if (!isVisible) return
    const textTimer = setTimeout(() => setShowText(true), 300)
    const butterflyTimer = setTimeout(() => setShowButterflies(true), 800)
    return () => {
      clearTimeout(textTimer)
      clearTimeout(butterflyTimer)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={weddingConfig.images.heroBackground}
          alt="Elegant wedding ballroom with crystal chandeliers and floral arrangements"
          fill
          className="object-cover"
          priority
        />
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
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.2) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Arabesque frame overlay */}
      <ArabesqueFrame
        className="absolute inset-4 sm:inset-8 z-10 w-[calc(100%-2rem)] h-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] sm:h-[calc(100%-4rem)]"
        color="rgba(200,169,110,0.6)"
        opacity={0.3}
        animate={showText}
      />

      {/* Gold particles */}
      <GoldParticles count={15} />

      {/* Butterflies */}
      <BirdsAnimation trigger={showButterflies} />

      {/* Hero Text */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Invitation wording */}
        <div
          className={`transition-all duration-1000 ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <p
            className={`font-serif text-xs tracking-[0.3em] uppercase text-center ${lang === "ar" ? "font-arabic tracking-normal text-sm" : ""}`}
            style={{
              color: "#fff",
              textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {t("hero", "requestHonour")}
          </p>
        </div>

        {/* Gold line above names */}
        <div
          className={`mt-5 transition-all duration-1000 ${showText ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="w-20 h-px mx-auto" style={{ background: "rgba(200,169,110,0.6)" }} />
        </div>

        {/* Names */}
        <div
          className={`mt-5 transition-all duration-1200 ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "600ms" }}
        >
          <h1 className={`text-center leading-tight text-balance ${lang === "ar" ? "font-arabic" : "font-script"}`}>
            <span
              className="block text-7xl sm:text-8xl"
              style={{
                color: "#fff",
                textShadow: "0 3px 16px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)",
              }}
            >
              {t("hero", "bride")}
            </span>
            <span
              className="block text-4xl sm:text-5xl my-2 font-serif"
              style={{
                color: "rgba(200,169,110,0.95)",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {t("hero", "and")}
            </span>
            <span
              className="block text-7xl sm:text-8xl"
              style={{
                color: "#fff",
                textShadow: "0 3px 16px rgba(0,0,0,0.4), 0 1px 6px rgba(0,0,0,0.3)",
              }}
            >
              {t("hero", "groom")}
            </span>
          </h1>
        </div>

        {/* Gold line below names */}
        <div
          className={`mt-5 transition-all duration-1000 ${showText ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="w-20 h-px mx-auto" style={{ background: "rgba(200,169,110,0.6)" }} />
        </div>

        {/* Date and time */}
        <div
          className={`mt-5 transition-all duration-1000 ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "1000ms" }}
        >
          <p
            className={`font-serif text-lg tracking-[0.2em] text-center ${lang === "ar" ? "font-arabic tracking-normal" : ""}`}
            style={{
              color: "#fff",
              textShadow: "0 2px 10px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {t("hero", "date")}
          </p>
          <p
            className={`font-serif text-sm tracking-[0.25em] uppercase text-center mt-2 ${lang === "ar" ? "font-arabic tracking-normal" : ""}`}
            style={{
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 2px 10px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            {t("hero", "time")}
          </p>
        </div>

        {/* Gold floral divider */}
        <div
          className={`mt-8 flex items-center gap-3 transition-all duration-1000 ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "1200ms" }}
        >
          <div className="w-10 h-px" style={{ background: "rgba(200,169,110,0.5)" }} />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="rgba(200,169,110,0.5)" />
            <circle cx="8" cy="8" r="2" fill="rgba(200,169,110,0.7)" />
          </svg>
          <div className="w-10 h-px" style={{ background: "rgba(200,169,110,0.5)" }} />
        </div>

        {/* Scroll hint */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${showText ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "1800ms" }}
        >
          <div className="flex flex-col items-center gap-2">
            <p
              className={`text-[10px] tracking-[0.2em] uppercase ${lang === "ar" ? "font-arabic tracking-normal text-xs" : ""}`}
              style={{
                color: "rgba(255,255,255,0.6)",
                fontFamily: lang === "ar" ? undefined : "var(--font-sans)",
                textShadow: "0 1px 6px rgba(0,0,0,0.3)",
              }}
            >
              {t("hero", "scrollDown")}
            </p>
            <div
              className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
              style={{ borderColor: "rgba(200,169,110,0.4)" }}
            >
              <div
                className="w-1 h-2 rounded-full animate-bounce"
                style={{ background: "rgba(200,169,110,0.6)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
