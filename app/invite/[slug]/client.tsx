"use client"

import { useState, useCallback } from "react"
import { LanguageProvider } from "@/context/language-context"
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
import type { Language } from "@/lib/types"

interface PersonalizedInviteClientProps {
  invitee: {
    id: string
    name_en: string
    name_ar: string
    slug: string
    max_guests: number
    language_preference: Language
  } | null
  langOverride?: Language
}

export function PersonalizedInviteClient({ invitee, langOverride }: PersonalizedInviteClientProps) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [whiteFlash, setWhiteFlash] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)

  const handleEnvelopeOpen = useCallback(() => {
    setMusicPlaying(true)
    setWhiteFlash(true)
    setTimeout(() => setEnvelopeOpen(true), 800)
    setTimeout(() => setShowContent(true), 1200)
    setTimeout(() => setWhiteFlash(false), 2000)
  }, [])

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

            <PhotoGallery />
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

            <Program />

            <FloralDivider lineColor="#c8a96e40" petalColor="#c8a96e" centerColor="#c8a96e" />

            <RSVP
              inviteeId={invitee?.id}
              maxGuests={invitee?.max_guests ?? 4}
            />
          </div>
        )}

        <MusicPlayer shouldPlay={musicPlaying} />
        {envelopeOpen && <LanguageToggle />}
      </main>
    </LanguageProvider>
  )
}
