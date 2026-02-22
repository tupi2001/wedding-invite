"use client"

import { useLanguage } from "@/context/language-context"

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      style={{
        background: "linear-gradient(135deg, rgba(200,169,110,0.9), rgba(180,149,90,0.9))",
        color: "#fff",
        backdropFilter: "blur(8px)",
      }}
      aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
      type="button"
    >
      <span className="text-sm font-semibold tracking-wide">
        {lang === "en" ? "ع" : "EN"}
      </span>
    </button>
  )
}
