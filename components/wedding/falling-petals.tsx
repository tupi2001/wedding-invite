"use client"

import { useMemo } from "react"

type PetalShape = "rose" | "leaf" | "blossom"

interface Petal {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  wobbleAmplitude: number
  sway: number
  swayDirection: number
  drift: number
  peakOpacity: number
  shape: PetalShape
  color: string
}

function PetalSVG({ shape, size, color }: { shape: PetalShape; size: number; color: string }) {
  switch (shape) {
    case "rose":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="11" rx="7" ry="9" fill={color} />
          <ellipse cx="10" cy="10" rx="5" ry="7" fill={color} opacity="0.6" />
        </svg>
      )
    case "leaf":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <path d="M10 1 C15 5 17 12 10 19 C3 12 5 5 10 1Z" fill={color} />
          <path d="M10 3 C10 9 10 14 10 17" stroke={color} strokeWidth="0.4" opacity="0.4" />
        </svg>
      )
    case "blossom":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <ellipse cx="10" cy="7" rx="3.5" ry="5" fill={color} opacity="0.9" />
          <ellipse cx="6" cy="11" rx="3.5" ry="4.5" fill={color} opacity="0.7" transform="rotate(-30 6 11)" />
          <ellipse cx="14" cy="11" rx="3.5" ry="4.5" fill={color} opacity="0.7" transform="rotate(30 14 11)" />
          <circle cx="10" cy="10" r="2" fill={color} opacity="0.5" />
        </svg>
      )
  }
}

export function FallingPetals({ count = 8 }: { count?: number }) {
  const petals = useMemo<Petal[]>(() => {
    const colors = [
      "rgba(200, 169, 110, 0.30)",
      "rgba(176, 141, 152, 0.25)",
      "rgba(196, 160, 171, 0.22)",
      "rgba(210, 185, 140, 0.28)",
      "rgba(138, 170, 126, 0.18)",
    ]
    const shapes: PetalShape[] = ["rose", "leaf", "blossom"]

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      size: 10 + Math.random() * 12,
      duration: 16 + Math.random() * 14,
      delay: Math.random() * 25,
      wobbleAmplitude: 30 + Math.random() * 60,
      sway: 30 + Math.random() * 50,
      swayDirection: Math.random() > 0.5 ? 1 : -1,
      drift: (Math.random() - 0.5) * 40,
      peakOpacity: 0.35 + Math.random() * 0.35,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[i % colors.length],
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-30" aria-hidden="true">
      <style jsx>{`
        @keyframes petal-drift {
          0% {
            transform: translateY(-5vh) translateX(0px) rotate(var(--wobble-start));
            opacity: 0;
          }
          6% {
            opacity: var(--peak-opacity);
          }
          15% {
            transform: translateY(12vh)
              translateX(calc(var(--sway) * var(--sway-dir) * 1px))
              rotate(calc(var(--wobble-start) + var(--wobble-amp) * -1deg));
          }
          30% {
            transform: translateY(28vh)
              translateX(calc(var(--sway) * var(--sway-dir) * -0.6px + var(--drift) * 0.3px))
              rotate(calc(var(--wobble-start) + var(--wobble-amp) * 0.7deg));
            opacity: var(--peak-opacity);
          }
          45% {
            transform: translateY(42vh)
              translateX(calc(var(--sway) * var(--sway-dir) * 0.9px + var(--drift) * 0.5px))
              rotate(calc(var(--wobble-start) + var(--wobble-amp) * -0.5deg));
          }
          60% {
            transform: translateY(58vh)
              translateX(calc(var(--sway) * var(--sway-dir) * -0.4px + var(--drift) * 0.7px))
              rotate(calc(var(--wobble-start) + var(--wobble-amp) * 0.8deg));
            opacity: calc(var(--peak-opacity) * 0.85);
          }
          75% {
            transform: translateY(72vh)
              translateX(calc(var(--sway) * var(--sway-dir) * 0.7px + var(--drift) * 0.85px))
              rotate(calc(var(--wobble-start) + var(--wobble-amp) * -0.3deg));
          }
          88% {
            opacity: calc(var(--peak-opacity) * 0.5);
          }
          100% {
            transform: translateY(105vh)
              translateX(calc(var(--drift) * 1px))
              rotate(calc(var(--wobble-start) + var(--wobble-amp) * 0.4deg));
            opacity: 0;
          }
        }
      `}</style>
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            ["--wobble-start" as string]: `${-15 + Math.random() * 30}deg`,
            ["--wobble-amp" as string]: p.wobbleAmplitude,
            ["--sway" as string]: p.sway,
            ["--sway-dir" as string]: p.swayDirection,
            ["--drift" as string]: p.drift,
            ["--peak-opacity" as string]: p.peakOpacity,
            animation: `petal-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        >
          <PetalSVG shape={p.shape} size={p.size} color={p.color} />
        </div>
      ))}
    </div>
  )
}
