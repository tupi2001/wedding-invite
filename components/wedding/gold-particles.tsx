"use client"

import { useMemo } from "react"

interface Particle {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function GoldParticles({ count = 20 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [count]
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <style jsx>{`
        @keyframes gold-float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: var(--base-opacity);
          }
          50% {
            transform: translateY(-15px) scale(1.3);
            opacity: calc(var(--base-opacity) * 1.5);
          }
        }
        @keyframes gold-twinkle {
          0%, 100% { opacity: var(--base-opacity); }
          50% { opacity: 0; }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(42 70% 65%) 0%, hsl(42 50% 50%) 100%)`,
            ["--base-opacity" as string]: p.opacity,
            opacity: p.opacity,
            animation: `${p.id % 3 === 0 ? "gold-twinkle" : "gold-float"} ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: "transform, opacity",
            boxShadow: `0 0 ${p.size * 2}px hsl(42 60% 60% / 0.3)`,
          }}
        />
      ))}
    </div>
  )
}
