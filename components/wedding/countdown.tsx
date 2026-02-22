"use client"

import { useState, useEffect } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useLanguage } from "@/context/language-context"
import { ArabesqueDivider } from "./arabesque-frame"
import { weddingConfig } from "@/config/wedding"

const WEDDING_DATE_UTC = new Date(weddingConfig.date.utc)

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const { ref, isVisible } = useScrollReveal()
  const { t, lang } = useLanguage()

  useEffect(() => {
    setMounted(true)
    const calc = () => {
      const nowUTC = new Date()
      const diff = WEDDING_DATE_UTC.getTime() - nowUTC.getTime()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [])

  const items = [
    { value: mounted ? timeLeft.days : 0, labelKey: "days" },
    { value: mounted ? timeLeft.hours : 0, labelKey: "hours" },
    { value: mounted ? timeLeft.minutes : 0, labelKey: "minutes" },
    { value: mounted ? timeLeft.seconds : 0, labelKey: "seconds" },
  ]

  return (
    <section
      ref={ref}
      className="relative w-full py-20 px-6"
      style={{
        background: "linear-gradient(165deg, #f8f5f0 0%, #f2ede5 40%, #efe9df 70%, #f4efe7 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(120,100,80,0.1) 4px, transparent 6px),
            repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(120,100,80,0.05) 4px, transparent 6px)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-sm mx-auto text-center">
        <div
          className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2
            className={`text-4xl ${lang === "ar" ? "font-arabic text-3xl" : "font-script"}`}
            style={{ color: "#5a6b50" }}
          >
            {t("countdown", "title")}
          </h2>
          <p
            className={`font-serif text-sm tracking-[0.2em] uppercase mt-3 ${lang === "ar" ? "font-arabic tracking-normal text-base" : ""}`}
            style={{ color: "#5a5a5a" }}
          >
            {t("countdown", "subtitle")}
          </p>
        </div>

        <ArabesqueDivider color="#c8a96e" className="mt-4 mb-2" />

        <div
          className="grid grid-cols-2 gap-4 mt-8"
          role="timer"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Wedding countdown timer"
        >
          {items.map((item, idx) => (
            <div
              key={item.labelKey}
              className={`rounded-xl py-6 px-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(200,169,110,0.15)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                transitionDelay: `${300 + idx * 150}ms`,
              }}
            >
              <span
                className="font-serif text-4xl font-light block"
                style={{ color: "#5a6b50" }}
                aria-label={`${item.value} ${t("countdown", item.labelKey)}`}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                className={`text-[10px] tracking-[0.25em] uppercase mt-2 block ${lang === "ar" ? "font-arabic tracking-normal text-xs" : ""}`}
                style={{ color: "#a09888", fontFamily: lang === "ar" ? undefined : "var(--font-sans)" }}
                aria-hidden="true"
              >
                {t("countdown", item.labelKey)}
              </span>
            </div>
          ))}
        </div>

        <div
          className={`mt-10 flex items-center justify-center gap-2 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="w-8 h-px" style={{ background: "#c8a96e50" }} />
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 0 L8 4 L12 6 L8 8 L6 12 L4 8 L0 6 L4 4 Z" fill="#c8a96e" opacity="0.35" />
          </svg>
          <div className="w-8 h-px" style={{ background: "#c8a96e50" }} />
        </div>

        <div
          className={`mt-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "900ms" }}
        >
          <a
            href="#rsvp"
            className={`inline-block font-serif text-sm tracking-[0.18em] uppercase py-3 px-8 rounded-full border transition-all duration-300 hover:scale-105 ${lang === "ar" ? "font-arabic tracking-normal text-base" : ""}`}
            style={{ borderColor: "#c8a96e80", color: "#5a6b50", background: "transparent" }}
          >
            {t("countdown", "confirmAttendance")}
          </a>
        </div>
      </div>
    </section>
  )
}
