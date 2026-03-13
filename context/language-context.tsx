"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Language } from "@/lib/types"
import { translations, type TranslationSection } from "@/lib/i18n"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: (section: TranslationSection, key: string) => string
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({
  children,
  defaultLang = "en",
}: {
  children: ReactNode
  defaultLang?: Language
}) {
  const [lang, setLang] = useState<Language>(defaultLang)

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"))
  }, [])

  const t = useCallback(
    (section: TranslationSection, key: string): string => {
      const sectionData = translations[lang]?.[section] as Record<string, string> | undefined
      if (!sectionData) return key
      return sectionData[key] ?? key
    },
    [lang]
  )

  const dir = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, dir }}>
      <div dir={dir} lang={lang}>
        {children}
      </div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
