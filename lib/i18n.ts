import type { Language } from "./types"
import { weddingConfig } from "@/config/wedding"

export const translations: Record<Language, Record<string, Record<string, string>>> =
  weddingConfig.translations

export type TranslationSection = keyof typeof translations.en

export function t(lang: Language, section: TranslationSection, key: string): string {
  const sectionData = translations[lang]?.[section]
  if (!sectionData) return key
  return sectionData[key] ?? key
}
