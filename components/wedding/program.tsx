"use client"

import { useState, useEffect, useRef } from "react"
import { Heart, Wine, Gem, GlassWater, UtensilsCrossed, Music } from "lucide-react"

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  return { ref, isVisible }
}

const schedule = [
  {
    time: "17:00",
    title: "Guest Arrival",
    description: "Welcome and reception at the ballroom",
    icon: Heart,
    color: "#b08d98",
  },
  {
    time: "17:30",
    title: "Welcome Drink",
    description: "Cocktails and hors d'oeuvres to start the celebration",
    icon: Wine,
    color: "#8aaa7e",
  },
  {
    time: "18:00",
    title: "Ceremony",
    description: "The most special moment of the day",
    icon: Gem,
    color: "#c4a0ab",
  },
  {
    time: "19:00",
    title: "Cocktail Hour",
    description: "Drinks and canapes in the garden terrace",
    icon: GlassWater,
    color: "#95b08a",
  },
  {
    time: "21:00",
    title: "Banquet",
    description: "Fine dining and celebration",
    icon: UtensilsCrossed,
    color: "#b08d98",
  },
  {
    time: "00:00",
    title: "Party",
    description: "Dancing until the early hours",
    icon: Music,
    color: "#8aaa7e",
  },
]

export function Program() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      ref={ref}
      id="program"
      className="relative w-full py-20 px-6"
      style={{ background: "#fff" }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="font-script text-4xl" style={{ color: "#2a2a2a" }}>
            {"Program of the Day"}
          </h2>
          <p
            className="font-serif text-sm tracking-[0.1em] mt-3"
            style={{ color: "#999" }}
          >
            {"What we have prepared for you"}
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-12 relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px"
            style={{ background: "rgba(176,141,152,0.15)" }}
            aria-hidden="true"
          />

          <div className="flex flex-col gap-8">
            {schedule.map((event, idx) => {
              const IconComponent = event.icon
              return (
                <div
                  key={event.time}
                  className={`relative flex items-start gap-5 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                  }`}
                  style={{ transitionDelay: `${300 + idx * 150}ms` }}
                >
                  {/* Icon */}
                  <div className="relative z-10 flex flex-col items-center gap-1 shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `${event.color}10`,
                        border: `1.5px solid ${event.color}25`,
                      }}
                    >
                      <IconComponent size={18} style={{ color: event.color }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-1 flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-sans text-xs font-bold tracking-wide px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "#b08d98",
                          color: "#fff",
                        }}
                      >
                        {event.time}
                      </span>
                      <h3 className="font-serif text-base font-semibold" style={{ color: "#2a2a2a" }}>
                        {event.title}
                      </h3>
                    </div>
                    <p className="font-sans text-sm mt-1" style={{ color: "#999" }}>
                      {event.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
