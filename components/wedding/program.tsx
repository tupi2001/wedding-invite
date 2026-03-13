"use client"

import { Heart, Wine, Gem, GlassWater, UtensilsCrossed, Music, type LucideIcon } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useLanguage } from "@/context/language-context"
import { ArabesqueDivider } from "./arabesque-frame"
import { weddingConfig } from "@/config/wedding"

const iconMap: Record<string, LucideIcon> = {
  Heart, Wine, Gem, GlassWater, UtensilsCrossed, Music,
}

const schedule = weddingConfig.program.map((item) => ({
  ...item,
  icon: iconMap[item.icon] || Heart,
}))

export function Program() {
  const { ref, isVisible } = useScrollReveal(0.15)
  const { t, lang } = useLanguage()

  return (
    <section
      ref={ref}
      id="program"
      className="relative w-full py-20 px-6"
      style={{ background: "linear-gradient(180deg, #fff 0%, #fdfcf9 50%, #f8f5f0 100%)" }}
    >
      <div className="max-w-md mx-auto">
        <div
          className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2
            className={`text-4xl ${lang === "ar" ? "font-arabic text-3xl" : "font-script"}`}
            style={{ color: "#2a2a2a" }}
          >
            {t("program", "title")}
          </h2>
          <p
            className={`font-serif text-sm tracking-[0.2em] uppercase mt-3 ${lang === "ar" ? "font-arabic tracking-normal text-base" : ""}`}
            style={{ color: "#666" }}
          >
            {t("program", "subtitle")}
          </p>
        </div>

        <ArabesqueDivider color="#c8a96e" className="mt-4 mb-6" />

        <div className="mt-8">
          <div className="flex flex-col gap-8">
            {schedule.map((event, idx) => {
              const IconComponent = event.icon
              return (
                <div
                  key={event.titleKey}
                  className={`relative flex ${lang === "ar" ? "flex-row-reverse" : "flex-row"} items-start gap-5 transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${lang === "ar" ? "translate-x-6" : "-translate-x-6"}`
                  }`}
                  style={{ transitionDelay: `${300 + idx * 150}ms` }}
                >
                  <div className="relative z-10 flex flex-col items-center gap-1 shrink-0">
                    {idx > 0 && (
                      <div
                        className="absolute w-[2px] bottom-full"
                        style={{
                          height: "2rem",
                          background: "rgba(200,169,110,0.35)",
                          [lang === "ar" ? "right" : "left"]: "50%",
                          transform: "translateX(-50%)",
                        }}
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: `${event.color}10`,
                        border: `1.5px solid ${event.color}25`,
                      }}
                    >
                      <IconComponent size={20} style={{ color: event.color }} />
                    </div>
                  </div>

                  <div className={`pt-1 flex-1 ${lang === "ar" ? "text-right" : "text-left"}`}>
                    <div className={`flex items-center gap-3 ${lang === "ar" ? "flex-row-reverse justify-end" : ""}`}>
                      {event.time && (
                        <span
                          className="font-sans text-xs font-bold tracking-wide px-2.5 py-0.5 rounded-full"
                          style={{ background: "#c8a96e", color: "#fff" }}
                        >
                          {event.time}
                        </span>
                      )}
                      <h3
                        className={`font-serif text-base font-semibold ${lang === "ar" ? "font-arabic" : ""}`}
                        style={{ color: "#2a2a2a" }}
                      >
                        {t("program", event.titleKey)}
                      </h3>
                    </div>
                    <p className={`font-sans text-sm mt-1 ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
                      {t("program", event.descKey)}
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
