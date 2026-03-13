"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/context/language-context"
import { ArabesqueDivider } from "./arabesque-frame"

interface PersonalizedWelcomeProps {
  guestNameEn?: string
  guestNameAr?: string
  isVisible: boolean
}

export function PersonalizedWelcome({
  guestNameEn,
  guestNameAr,
  isVisible,
}: PersonalizedWelcomeProps) {
  const { t, lang } = useLanguage()
  const guestName = lang === "ar" ? (guestNameAr || guestNameEn) : guestNameEn

  if (!isVisible) return null

  return (
    <section
      className="relative w-full py-20 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f4efe7 0%, #faf8f5 30%, #fdf9f4 70%, #f8f5f0 100%)",
      }}
    >
      {/* Geometric pattern background */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="welcome-geo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M10 0 L20 10 L10 20 L0 10 Z" stroke="#c8a96e" strokeWidth="0.3" fill="none" />
            <circle cx="10" cy="10" r="2" stroke="#c8a96e" strokeWidth="0.2" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#welcome-geo)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <ArabesqueDivider color="#c8a96e" className="mb-8" />

        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p
              className="font-serif text-sm tracking-[0.3em] uppercase"
              style={{ color: "#c8a96e" }}
            >
              {t("welcome", "dear")}
            </p>
            <h2
              className={`mt-3 ${lang === "ar" ? "font-arabic-display text-4xl sm:text-5xl font-medium" : "font-script text-5xl sm:text-6xl"}`}
              style={{ color: "#2a2a2a" }}
            >
              {guestName}
            </h2>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: guestName ? 0.6 : 0.3 }}
          className="mt-10"
        >
          <p
            className={`font-serif text-base leading-relaxed ${lang === "ar" ? "font-arabic text-lg" : ""}`}
            style={{ color: "#666" }}
          >
            {t("welcome", "invitedTo")}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span
              className="font-script text-3xl"
              style={{ color: "#b08d98" }}
            >
              {t("hero", "bride")}
            </span>
            <span
              className="font-serif text-xl"
              style={{ color: "#c8a96e" }}
            >
              {t("welcome", "and")}
            </span>
            <span
              className="font-script text-3xl"
              style={{ color: "#b08d98" }}
            >
              {t("hero", "groom")}
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className={`mt-8 font-serif text-sm leading-relaxed ${lang === "ar" ? "font-arabic text-base" : ""}`}
          style={{ color: "#888" }}
        >
          {t("welcome", "together")}
        </motion.p>

        <ArabesqueDivider color="#c8a96e" className="mt-8" />
      </div>
    </section>
  )
}
