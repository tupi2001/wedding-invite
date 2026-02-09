"use client"

import { useState, useCallback } from "react"
import { Envelope } from "@/components/wedding/envelope"
import { HeroSection } from "@/components/wedding/hero-section"
import { Countdown } from "@/components/wedding/countdown"
import { Location } from "@/components/wedding/location"
import { Program } from "@/components/wedding/program"
import { RSVP } from "@/components/wedding/rsvp"
import { MusicPlayer } from "@/components/wedding/music-player"

export default function Page() {
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
    <>
      {!envelopeOpen && <Envelope onOpen={handleEnvelopeOpen} />}
      <main className="relative min-h-screen overflow-x-hidden">
      {whiteFlash && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{
            background: "#fff",
            animation: "fade-in 0.5s ease-out forwards",
          }}
        />
      )}

      {envelopeOpen && (
        <div
          style={{
            opacity: showContent ? 1 : 0,
            transition: "opacity 1s ease-out",
          }}
        >
          <HeroSection isVisible={showContent} />

          {/* Soft gradient into countdown */}
          <div
            className="relative h-16"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.15), #f4efe7)",
            }}
            aria-hidden="true"
          />

          <Countdown />

          {/* Gradient out of countdown */}
          <div
            className="relative h-12"
            style={{
              background: "linear-gradient(to bottom, #f4efe7, #fff)",
            }}
            aria-hidden="true"
          />

          <Location />

          {/* Elegant thin divider */}
          <div
            className="flex items-center justify-center py-8"
            style={{ background: "#fff" }}
            aria-hidden="true"
          >
            <div className="w-16 h-px" style={{ background: "#ddd5ca" }} />
            <div className="mx-4">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                {[0, 72, 144, 216, 288].map((angle) => (
                  <ellipse
                    key={angle}
                    cx={7 + Math.cos((angle * Math.PI) / 180) * 3}
                    cy={7 + Math.sin((angle * Math.PI) / 180) * 3}
                    rx="2"
                    ry="1.4"
                    fill="#c4b0b6"
                    opacity="0.35"
                    transform={`rotate(${angle} ${7 + Math.cos((angle * Math.PI) / 180) * 3} ${7 + Math.sin((angle * Math.PI) / 180) * 3})`}
                  />
                ))}
                <circle cx="7" cy="7" r="1.2" fill="#5a6b50" opacity="0.3" />
              </svg>
            </div>
            <div className="w-16 h-px" style={{ background: "#ddd5ca" }} />
          </div>

          <Program />

          {/* Elegant thin divider */}
          <div
            className="flex items-center justify-center py-8"
            style={{ background: "#fff" }}
            aria-hidden="true"
          >
            <div className="w-16 h-px" style={{ background: "#ddd5ca" }} />
            <div className="mx-4">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                {[0, 72, 144, 216, 288].map((angle) => (
                  <ellipse
                    key={angle}
                    cx={7 + Math.cos((angle * Math.PI) / 180) * 3}
                    cy={7 + Math.sin((angle * Math.PI) / 180) * 3}
                    rx="2"
                    ry="1.4"
                    fill="#c4b0b6"
                    opacity="0.35"
                    transform={`rotate(${angle} ${7 + Math.cos((angle * Math.PI) / 180) * 3} ${7 + Math.sin((angle * Math.PI) / 180) * 3})`}
                  />
                ))}
                <circle cx="7" cy="7" r="1.2" fill="#5a6b50" opacity="0.3" />
              </svg>
            </div>
            <div className="w-16 h-px" style={{ background: "#ddd5ca" }} />
          </div>

          <RSVP />

          {/* Footer */}
          <footer
            className="py-10 text-center"
            style={{ background: "#f8f5f0" }}
          >
            <p
              className="font-script text-2xl"
              style={{ color: "#a09080" }}
            >
              {"Nada & Karim"}
            </p>
            <p
              className="text-[10px] tracking-[0.3em] uppercase mt-2"
              style={{ color: "#c0b5a8", fontFamily: "var(--font-sans)" }}
            >
              {"22 May 2026"}
            </p>
          </footer>
        </div>
      )}

      <MusicPlayer shouldPlay={musicPlaying} />
      </main>
    </>
  )
}
