"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export function MusicPlayer({ shouldPlay }: { shouldPlay: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  const createMelody = useCallback(() => {
    if (audioContextRef.current) return

    const ctx = new AudioContext()
    audioContextRef.current = ctx

    // Romantic wedding melody
    const notes = [
      { freq: 523.25, time: 0, dur: 0.8 },
      { freq: 659.25, time: 0.5, dur: 0.8 },
      { freq: 783.99, time: 1.0, dur: 0.8 },
      { freq: 1046.50, time: 1.5, dur: 1.2 },
      { freq: 783.99, time: 2.5, dur: 0.8 },
      { freq: 659.25, time: 3.0, dur: 0.8 },
      { freq: 698.46, time: 3.5, dur: 0.8 },
      { freq: 783.99, time: 4.0, dur: 1.0 },
      { freq: 659.25, time: 5.0, dur: 0.6 },
      { freq: 523.25, time: 5.5, dur: 0.6 },
      { freq: 587.33, time: 6.0, dur: 0.8 },
      { freq: 523.25, time: 6.5, dur: 1.5 },
      { freq: 523.25, time: 8.0, dur: 0.8 },
      { freq: 659.25, time: 8.5, dur: 0.8 },
      { freq: 783.99, time: 9.0, dur: 0.8 },
      { freq: 880.00, time: 9.5, dur: 1.0 },
      { freq: 783.99, time: 10.5, dur: 0.8 },
      { freq: 698.46, time: 11.0, dur: 0.6 },
      { freq: 659.25, time: 11.5, dur: 0.8 },
      { freq: 587.33, time: 12.0, dur: 0.6 },
      { freq: 523.25, time: 12.5, dur: 2.0 },
    ]

    const playPhrase = (startTime: number) => {
      for (const note of notes) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const filter = ctx.createBiquadFilter()

        osc.type = "sine"
        osc.frequency.value = note.freq

        filter.type = "lowpass"
        filter.frequency.value = 2000
        filter.Q.value = 1

        const t = startTime + note.time
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.08, t + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.04, t + note.dur * 0.5)
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)

        osc.start(t)
        osc.stop(t + note.dur + 0.1)
      }
    }

    const totalDuration = 14.5
    const now = ctx.currentTime
    for (let i = 0; i < 8; i++) {
      playPhrase(now + i * totalDuration)
    }

    setIsPlaying(true)
  }, [])

  useEffect(() => {
    if (shouldPlay) {
      setIsVisible(true)
      createMelody()
    }
  }, [shouldPlay, createMelody])

  const toggleMusic = useCallback(() => {
    if (!audioContextRef.current) return
    if (isPlaying) {
      audioContextRef.current.suspend()
      setIsPlaying(false)
    } else {
      audioContextRef.current.resume()
      setIsPlaying(true)
    }
  }, [isPlaying])

  if (!isVisible) return null

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
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
