"use client"

import { useLanguage } from "@/context/language-context"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function VerseSection() {
  const { t, lang } = useLanguage()
  const { ref, isVisible } = useScrollReveal(0.2)

  return (
    <section
      ref={ref}
      className="relative w-full py-24 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #fdfcf9 0%, #f8f5f0 30%, #f4efe7 70%, #f8f5f0 100%)",
      }}
    >
      {/* Islamic geometric pattern background */}
      <div className="absolute inset-0 opacity-[0.035]" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="islamic-geo"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* Eight-pointed star (Rub el Hizb) */}
              <path
                d="M30 5 L35 25 L55 30 L35 35 L30 55 L25 35 L5 30 L25 25 Z"
                stroke="#c8a96e"
                strokeWidth="0.5"
                fill="none"
              />
              <path
                d="M30 12 L33 25 L46 30 L33 33 L30 48 L27 33 L14 30 L27 25 Z"
                stroke="#c8a96e"
                strokeWidth="0.3"
                fill="none"
              />
              <circle cx="30" cy="30" r="3" stroke="#c8a96e" strokeWidth="0.3" fill="none" />
              {/* Corner connectors */}
              <path d="M0 0 L10 10" stroke="#c8a96e" strokeWidth="0.3" />
              <path d="M60 0 L50 10" stroke="#c8a96e" strokeWidth="0.3" />
              <path d="M0 60 L10 50" stroke="#c8a96e" strokeWidth="0.3" />
              <path d="M60 60 L50 50" stroke="#c8a96e" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-geo)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center">
        {/* Decorative top */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="mx-auto" aria-hidden="true">
            <path
              d="M0 30 Q15 0 30 10 Q45 0 60 30"
              stroke="#c8a96e"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M10 28 Q22 5 30 12 Q38 5 50 28"
              stroke="#c8a96e"
              strokeWidth="0.6"
              fill="none"
              opacity="0.3"
            />
            <circle cx="30" cy="8" r="2.5" fill="#c8a96e" opacity="0.3" />
          </svg>
        </div>

        {/* Bismillah */}
        <div
          className={`mt-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <p
            className="font-arabic text-3xl leading-relaxed"
            style={{ color: "#c8a96e" }}
            dir="rtl"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* Main verse - Quran 30:21 (Ar-Rum) */}
        <div
          className={`mt-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <blockquote dir="rtl">
            <p
              className="font-arabic text-xl sm:text-2xl leading-[2.4]"
              style={{ color: "#2a2a2a" }}
            >
              وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
            </p>
          </blockquote>
        </div>

        {/* Decorative bottom */}
        <div
          className={`mt-8 transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{ transitionDelay: "1100ms" }}
        >
          <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className="mx-auto rotate-180" aria-hidden="true">
            <path
              d="M0 30 Q15 0 30 10 Q45 0 60 30"
              stroke="#c8a96e"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M10 28 Q22 5 30 12 Q38 5 50 28"
              stroke="#c8a96e"
              strokeWidth="0.6"
              fill="none"
              opacity="0.3"
            />
            <circle cx="30" cy="8" r="2.5" fill="#c8a96e" opacity="0.3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
