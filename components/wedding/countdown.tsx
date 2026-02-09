"use client"

import { useState, useEffect, useRef } from "react"

const WEDDING_DATE = new Date("2026-05-22T17:00:00")

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  return { ref, isVisible }
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const { ref, isVisible } = useScrollReveal()

  useEffect(() => {
    const calc = () => {
      const now = new Date()
      const diff = WEDDING_DATE.getTime() - now.getTime()
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
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ]

  return (
    <section
      ref={ref}
      className="relative w-full py-20 px-6"
      style={{
        background: "linear-gradient(165deg, #f8f5f0 0%, #f2ede5 40%, #efe9df 70%, #f4efe7 100%)",
      }}
    >
      {/* Very subtle textile texture */}
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
        {/* Header */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            className="font-script text-4xl"
            style={{ color: "#5a6b50" }}
          >
            {"Countdown"}
          </h2>
          <p
            className="font-serif text-sm tracking-[0.12em] mt-3"
            style={{ color: "#8a8070" }}
          >
            {"To the most special day of our lives"}
          </p>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          {items.map((item, idx) => (
            <div
              key={item.label}
              className={`rounded-xl py-6 px-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(180,170,155,0.2)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                transitionDelay: `${300 + idx * 150}ms`,
              }}
            >
              <span
                className="font-serif text-4xl font-light block"
                style={{ color: "#5a6b50" }}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                className="text-[10px] tracking-[0.25em] uppercase mt-2 block"
                style={{
                  color: "#a09888",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Small floral accent */}
        <div
          className={`mt-10 flex items-center justify-center gap-2 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <div className="w-8 h-px" style={{ background: "#c8bfb2" }} />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={angle}
                cx={7 + Math.cos((angle * Math.PI) / 180) * 3}
                cy={7 + Math.sin((angle * Math.PI) / 180) * 3}
                rx="2"
                ry="1.4"
                fill="#c4b0b6"
                opacity="0.4"
                transform={`rotate(${angle} ${7 + Math.cos((angle * Math.PI) / 180) * 3} ${7 + Math.sin((angle * Math.PI) / 180) * 3})`}
              />
            ))}
            <circle cx="7" cy="7" r="1.2" fill="#5a6b50" opacity="0.35" />
          </svg>
          <div className="w-8 h-px" style={{ background: "#c8bfb2" }} />
        </div>

        {/* CTA */}
        <div
          className={`mt-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <a
            href="#rsvp"
            className="inline-block font-serif text-sm tracking-[0.18em] uppercase py-3 px-8 rounded-full border transition-all duration-300 hover:scale-105"
            style={{
              borderColor: "#c8bfb2",
              color: "#5a6b50",
              background: "transparent",
            }}
          >
            {"Confirm Attendance"}
          </a>
        </div>
      </div>
    </section>
  )
}
