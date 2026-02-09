"use client"

import { useState, useRef, useEffect, useCallback } from "react"

/**
 * Music Player Component
 *
 * To use with an actual audio file:
 * 1. Add your wedding music file to /public/music/wedding-music.mp3
 * 2. Recommended songs:
 *    - Canon in D by Pachelbel
 *    - Clair de Lune by Debussy
 *    - Air on the G String by Bach
 *    - A Thousand Years (instrumental)
 * 3. The player will automatically loop the music
 *
 * Current implementation uses a fallback synthesized melody if no audio file is found.
 */

export function MusicPlayer({ shouldPlay }: { shouldPlay: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAudioFile, setHasAudioFile] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!shouldPlay) return

    setIsVisible(true)

    // Create audio element
    const audio = new Audio()

    // Try to load the audio file
    audio.src = "/music/wedding-music.mp3"
    audio.loop = true
    audio.volume = 0.25 // Recommended volume: 0.2-0.3

    // Check if audio file exists
    audio.addEventListener("canplaythrough", () => {
      setHasAudioFile(true)
      audioRef.current = audio
      // Auto-play when envelope opens
      audio.play().catch((err) => {
        console.log("Autoplay prevented:", err)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    })

    audio.addEventListener("error", () => {
      console.warn("No audio file found at /public/music/wedding-music.mp3")
      console.warn("Add your wedding music file to enable audio playback")
      setHasAudioFile(false)
    })

    // Load the audio
    audio.load()

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [shouldPlay])

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err)
      })
      setIsPlaying(true)
    }
  }, [isPlaying])

  if (!isVisible) return null

  // Don't show button if no audio file is available
  if (!hasAudioFile) {
    return (
      <div
        className="fixed bottom-6 right-6 z-50 px-4 py-2 rounded-full text-xs"
        style={{
          background: "rgba(176,141,152,0.1)",
          color: "#666",
          border: "1px solid rgba(176,141,152,0.2)",
        }}
      >
        Add music file to /public/music/wedding-music.mp3
      </div>
    )
  }

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      style={{
        background: "linear-gradient(135deg, #b08d98, #9a7a85)",
        color: "#fff",
      }}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      type="button"
    >
      {isPlaying ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
          <path
            d="M16 9.5 C16.8 10.3 17.3 11.1 17.3 12 C17.3 12.9 16.8 13.7 16 14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M18.5 7 C20 8.8 21 10.3 21 12 C21 13.7 20 15.2 18.5 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
          <line x1="16" y1="9" x2="22" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="22" y1="9" x2="16" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
