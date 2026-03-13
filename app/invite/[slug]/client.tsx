"use client"

import { useState, useEffect, useCallback } from "react"
import { LanguageProvider, useLanguage } from "@/context/language-context"
import { Envelope } from "@/components/wedding/envelope"
import { HeroSection } from "@/components/wedding/hero-section"
import { PersonalizedWelcome } from "@/components/wedding/personalized-welcome"
import { PhotoGallery } from "@/components/wedding/photo-gallery"
import { VerseSection } from "@/components/wedding/verse-section"
import { Countdown } from "@/components/wedding/countdown"
import { Location } from "@/components/wedding/location"
import { Program } from "@/components/wedding/program"
import { RSVP } from "@/components/wedding/rsvp"
import { MusicPlayer } from "@/components/wedding/music-player"
import { LanguageToggle } from "@/components/wedding/language-toggle"
import { FallingPetals } from "@/components/wedding/falling-petals"
import { FloralDivider } from "@/components/wedding/floral-divider"
import { ArabesqueDivider } from "@/components/wedding/arabesque-frame"
import { weddingConfig } from "@/config/wedding"
import type { Language } from "@/lib/types"

interface InviteeData {
  id: string
  name_en: string
  name_ar: string
  slug: string
  max_guests: number
  language_preference: Language
}

interface Photo {
  src: string
  alt: string
}

interface PersonalizedInviteClientProps {
  invitee: InviteeData | null
  langOverride?: Language
  photos: Photo[]
}

function ThankYouView({ invitee }: { invitee: InviteeData }) {
  const { t, lang } = useLanguage()

  const guestName = lang === "ar" ? (invitee.name_ar || invitee.name_en) : invitee.name_en

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <FallingPetals count={6} />

      <section
        className="relative w-full py-24 px-6 text-center"
        style={{
          background: "linear-gradient(165deg, #f8f5f0 0%, #f2ede5 40%, #efe9df 70%, #f4efe7 100%)",
        }}
      >
        <div className="max-w-md mx-auto">
          <svg width="60" height="50" viewBox="0 0 60 50" fill="none" className="mx-auto mb-8" aria-hidden="true">
            <path
              d="M22 42S4 28 4 16C4 9 9 4 16 4c4.5 0 6.5 3 6 5.5C20 6 17 4 22 4c-5.5 3-6.5 5.5-6.5 5.5S22 4 22 4"
              fill="none" stroke="none"
            />
            <path
              d="M30 44S6 28 6 15a10.5 10.5 0 0 1 10.5-10.5C22 4.5 26 7.5 30 12c4-4.5 8-7.5 13.5-7.5A10.5 10.5 0 0 1 54 15c0 13-24 29-24 29Z"
              fill="rgba(200,169,110,0.06)"
              stroke="#c8a96e"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M30 38S12 26 12 17a7 7 0 0 1 7-7c3 0 6 2 11 7 5-5 8-7 11-7a7 7 0 0 1 7 7c0 9-18 21-18 21Z"
              fill="rgba(200,169,110,0.1)"
              stroke="#c8a96e"
              strokeWidth="0.75"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>

          <p
            className={`text-sm tracking-[0.15em] uppercase ${lang === "ar" ? "font-arabic tracking-normal text-base" : "font-sans"}`}
            style={{ color: "#a09888" }}
          >
            {t("welcome", "dear")}
          </p>
          <h2
            className={`mt-2 ${lang === "ar" ? "font-arabic-display text-[2.25rem] font-medium" : "font-script text-3xl"}`}
            style={{ color: "#2a2a2a" }}
          >
            {guestName}
          </h2>

          <h1
            className={`text-xl mt-8 ${lang === "ar" ? "font-arabic text-lg" : "font-serif"}`}
            style={{ color: "#5a6b50" }}
          >
            {t("rsvp", "thankYouConfirmed")}
          </h1>

          <p
            className={`font-serif text-sm mt-3 ${lang === "ar" ? "font-arabic text-base" : ""}`}
            style={{ color: "#888" }}
          >
            {t("rsvp", "seeYouThere")}
          </p>

          <ArabesqueDivider color="#c8a96e" className="mt-10 mb-2" />

          <p
            className={`font-serif text-base mt-6 ${lang === "ar" ? "font-arabic" : ""}`}
            style={{ color: "#5a5a5a" }}
          >
            {weddingConfig.date.display[lang]}
          </p>
          <p
            className={`font-serif text-sm mt-1 ${lang === "ar" ? "font-arabic" : ""}`}
            style={{ color: "#888" }}
          >
            {weddingConfig.date.time[lang]}
          </p>

          <a
            href={(() => {
              const start = new Date(weddingConfig.date.utc)
              const end = new Date(start.getTime() + 5 * 60 * 60 * 1000)
              const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
              const params = new URLSearchParams({
                action: "TEMPLATE",
                text: `${weddingConfig.couple.coupleNames.en} Wedding`,
                dates: `${fmt(start)}/${fmt(end)}`,
                location: `${weddingConfig.venue.venue.en}, ${weddingConfig.venue.address.en}, ${weddingConfig.venue.city.en}`,
                details: `Wedding celebration of ${weddingConfig.couple.coupleNames.en}`,
              })
              return `https://calendar.google.com/calendar/render?${params.toString()}`
            })()}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 mt-8 font-serif text-sm tracking-[0.15em] uppercase py-3 px-8 rounded-full border transition-all duration-300 hover:scale-[1.02] hover:bg-[rgba(200,169,110,0.08)] ${lang === "ar" ? "font-arabic tracking-normal text-base" : ""}`}
            style={{ borderColor: "#c8a96e80", color: "#5a6b50", boxShadow: "0 4px 20px rgba(200,169,110,0.15)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {lang === "ar" ? "أضف للتقويم" : "Add to Calendar"}
          </a>
        </div>
      </section>

      <div
        className="relative h-12"
        style={{ background: "linear-gradient(to bottom, #f4efe7, #f4efe7)" }}
        aria-hidden="true"
      />

      <Countdown hideRsvpButton />

      <div
        className="relative h-12"
        style={{ background: "linear-gradient(to bottom, #f4efe7, #fff)" }}
        aria-hidden="true"
      />

      <Location />

      <FloralDivider lineColor="#c8a96e40" petalColor="#c8a96e" centerColor="#c8a96e" />

      <Program />

      <LanguageToggle />
    </main>
  )
}

export function PersonalizedInviteClient({ invitee, langOverride, photos }: PersonalizedInviteClientProps) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [whiteFlash, setWhiteFlash] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [groupFull, setGroupFull] = useState(false)
  const [checkingGroup, setCheckingGroup] = useState(!!invitee)

  useEffect(() => {
    if (!invitee) {
      setCheckingGroup(false)
      return
    }
    fetch(`/api/rsvp?invitee_id=${invitee.id}`)
      .then((r) => r.json())
      .then((data) => {
        const accepted = (data.responses || []).filter(
          (r: { attending: string }) => r.attending === "accept"
        ).length
        if (accepted >= invitee.max_guests) setGroupFull(true)
      })
      .catch(() => {})
      .finally(() => setCheckingGroup(false))
  }, [invitee])

  const handleEnvelopeOpen = useCallback(() => {
    setMusicPlaying(true)
    setWhiteFlash(true)
    setTimeout(() => setEnvelopeOpen(true), 800)
    setTimeout(() => setShowContent(true), 1200)
    setTimeout(() => setWhiteFlash(false), 2000)
  }, [])

  if (checkingGroup) {
    return (
      <LanguageProvider defaultLang={langOverride ?? invitee?.language_preference ?? "en"}>
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: "linear-gradient(180deg, #fdfcf9 0%, #f8f6f3 100%)", zIndex: 9999 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#c8a96e40] border-t-[#c8a96e] animate-spin" />
            <p className="font-serif text-xs tracking-[0.2em] uppercase" style={{ color: "#c8a96e80" }}>
              Preparing your invitation...
            </p>
            <p className="font-serif text-[11px]" style={{ color: "#c8a96e60" }}>
              We&apos;re so glad you&apos;re here
            </p>
          </div>
        </div>
      </LanguageProvider>
    )
  }

  if (groupFull && invitee) {
    return (
      <LanguageProvider defaultLang={langOverride ?? invitee.language_preference ?? "en"}>
        <ThankYouView invitee={invitee} />
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider defaultLang={langOverride ?? invitee?.language_preference ?? "en"}>
      {!envelopeOpen && <Envelope onOpen={handleEnvelopeOpen} />}
      <main className="relative min-h-screen overflow-x-hidden">
        {whiteFlash && (
          <div
            className="fixed inset-0 z-40 pointer-events-none"
            style={{ background: "#fff", animation: "fade-in 0.5s ease-out forwards" }}
          />
        )}

        {envelopeOpen && (
          <div style={{ opacity: showContent ? 1 : 0, transition: "opacity 1s ease-out" }}>
            <FallingPetals count={10} />

            <HeroSection isVisible={showContent} />

            <div
              className="relative h-16"
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15), #f4efe7)" }}
              aria-hidden="true"
            />

            <PersonalizedWelcome
              guestNameEn={invitee?.name_en}
              guestNameAr={invitee?.name_ar}
              isVisible={showContent}
            />

            <PhotoGallery photos={photos} />
            <VerseSection />

            <div
              className="relative h-12"
              style={{ background: "linear-gradient(to bottom, #f8f5f0, #f4efe7)" }}
              aria-hidden="true"
            />

            <Countdown />

            <div
              className="relative h-12"
              style={{ background: "linear-gradient(to bottom, #f4efe7, #fff)" }}
              aria-hidden="true"
            />

            <Location />

            <FloralDivider lineColor="#c8a96e40" petalColor="#c8a96e" centerColor="#c8a96e" />

            <RSVP
              inviteeId={invitee?.id}
              maxGuests={invitee?.max_guests ?? 4}
              onGroupFull={() => setGroupFull(true)}
            />
          </div>
        )}

        <MusicPlayer shouldPlay={musicPlaying} />
      </main>
      <LanguageToggle />
    </LanguageProvider>
  )
}
