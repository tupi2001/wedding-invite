"use client"

import { useEffect, useState, useMemo } from "react"

interface ButterflyConfig {
  id: number
  startX: number
  startY: number
  size: number
  delay: number
  wing: string
  wingInner: string
  wingTip: string
  body: string
  spot: string
}

export function BirdsAnimation({ trigger }: { trigger: boolean }) {
  const [phase, setPhase] = useState<"idle" | "flyAway" | "flyBack" | "resting">("idle")

  const butterflies = useMemo<ButterflyConfig[]>(
    () => [
      {
        id: 0, startX: 30, startY: 68, size: 90, delay: 0,
        wing: "#d4a0aa", wingInner: "#e8c4cc", wingTip: "#c48898",
        body: "#8a5d68", spot: "#f0dce0",
      },
      {
        id: 1, startX: 65, startY: 62, size: 80, delay: 0.35,
        wing: "#a8c4a0", wingInner: "#c8dcc4", wingTip: "#8aaa82",
        body: "#5e7858", spot: "#dcecd8",
      },
      {
        id: 2, startX: 48, startY: 72, size: 100, delay: 0.15,
        wing: "#c8a8b4", wingInner: "#e0ccd4", wingTip: "#b890a0",
        body: "#7a5868", spot: "#f0e0e8",
      },
    ],
    [],
  )

  useEffect(() => {
    if (!trigger) return

    const timers: ReturnType<typeof setTimeout>[] = []

    // Start the first cycle
    const rafId = requestAnimationFrame(() => {
      timers.push(setTimeout(() => setPhase("flyAway"), 100))
      timers.push(setTimeout(() => setPhase("flyBack"), 4000))
      timers.push(setTimeout(() => setPhase("resting"), 7500))

      // Loop the animation every 12 seconds
      const loopInterval = setInterval(() => {
        setPhase("idle")
        setTimeout(() => setPhase("flyAway"), 100)
        setTimeout(() => setPhase("flyBack"), 4000)
        setTimeout(() => setPhase("resting"), 7500)
      }, 12000)

      timers.push(loopInterval as any)
    })

    return () => {
      cancelAnimationFrame(rafId)
      timers.forEach(clearTimeout)
    }
  }, [trigger])

  if (!trigger) return null

  const isFlapping = phase === "flyAway" || phase === "flyBack"

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {butterflies.map((b) => {
        // Rest position: near the names in center of viewport
        const restX = 40 + b.id * 10
        const restY = 42 + b.id * 4

        let tx = 0
        let ty = 0
        let sc = 1
        let dur = "3s"

        if (phase === "flyAway") {
          // Fly INTO the image - toward the back/top of the ballroom, shrink for depth
          tx = (50 - b.startX) + (b.id - 1) * 5
          ty = -(b.startY - 15)
          sc = 0.3
          dur = `${3 + b.delay}s`
        } else if (phase === "flyBack") {
          // Return and settle near the names
          tx = restX - b.startX
          ty = restY - b.startY
          sc = 0.7
          dur = `${3 + b.delay}s`
        } else if (phase === "resting") {
          tx = restX - b.startX
          ty = restY - b.startY
          sc = 0.7
        }

        return (
          <div
            key={b.id}
            className="absolute"
            style={{
              left: `${b.startX}%`,
              top: `${b.startY}%`,
              transform: `translate(${tx}vw, ${ty}vh) scale(${sc})`,
              transition: `transform ${dur} cubic-bezier(0.4, 0, 0.2, 1) ${b.delay}s`,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
              willChange: "transform",
            }}
          >
            <svg
              width={b.size}
              height={b.size}
              viewBox="0 0 100 100"
              fill="none"
              style={{ overflow: "visible" }}
            >
              {/* ======= LEFT UPPER WING ======= */}
              <path d="M50 50 C42 36 26 12 12 20 C-2 28 10 44 28 48 C38 50 46 50 50 50" fill={b.wing} opacity="0.85">
                {isFlapping && (
                  <animate
                    attributeName="d"
                    values="M50 50 C42 36 26 12 12 20 C-2 28 10 44 28 48 C38 50 46 50 50 50;M50 50 C46 42 38 34 34 38 C30 42 38 48 50 50;M50 50 C42 36 26 12 12 20 C-2 28 10 44 28 48 C38 50 46 50 50 50"
                    dur="0.35s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              {/* Inner gradient layer */}
              <path d="M50 50 C44 38 30 18 18 24 C8 30 16 42 30 47 C40 49 47 50 50 50" fill={b.wingInner} opacity="0.55">
                {isFlapping && (
                  <animate
                    attributeName="d"
                    values="M50 50 C44 38 30 18 18 24 C8 30 16 42 30 47 C40 49 47 50 50 50;M50 50 C47 44 40 36 37 39 C34 42 42 48 50 50;M50 50 C44 38 30 18 18 24 C8 30 16 42 30 47 C40 49 47 50 50 50"
                    dur="0.35s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              {/* Wing spots */}
              <ellipse cx="24" cy="28" rx="6" ry="5" fill={b.spot} opacity="0.5" />
              <ellipse cx="24" cy="28" rx="3" ry="2.5" fill={b.wingTip} opacity="0.4" />
              <circle cx="18" cy="36" r="2.5" fill={b.spot} opacity="0.4" />
              <circle cx="32" cy="24" r="1.5" fill={b.spot} opacity="0.3" />
              {/* Veins */}
              <path d="M50 50 C42 38 28 22 16 24" stroke={b.body} strokeWidth="0.4" fill="none" opacity="0.15" />
              <path d="M50 50 C44 40 34 30 22 32" stroke={b.body} strokeWidth="0.3" fill="none" opacity="0.1" />
              {/* Wing edge */}
              <path d="M50 50 C42 36 26 12 12 20" stroke={b.wingTip} strokeWidth="0.5" fill="none" opacity="0.2" />

              {/* ======= LEFT LOWER WING ======= */}
              <path d="M50 50 C40 58 24 72 16 64 C8 56 20 46 36 48 C44 49 48 50 50 50" fill={b.wing} opacity="0.75">
                {isFlapping && (
                  <animate
                    attributeName="d"
                    values="M50 50 C40 58 24 72 16 64 C8 56 20 46 36 48 C44 49 48 50 50 50;M50 50 C46 54 38 56 36 54 C34 52 42 50 50 50;M50 50 C40 58 24 72 16 64 C8 56 20 46 36 48 C44 49 48 50 50 50"
                    dur="0.35s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <ellipse cx="28" cy="60" rx="4" ry="3" fill={b.spot} opacity="0.35" />
              <path d="M50 50 C42 56 28 64 20 60" stroke={b.body} strokeWidth="0.3" fill="none" opacity="0.1" />

              {/* ======= RIGHT UPPER WING ======= */}
              <path d="M50 50 C58 36 74 12 88 20 C102 28 90 44 72 48 C62 50 54 50 50 50" fill={b.wing} opacity="0.85">
                {isFlapping && (
                  <animate
                    attributeName="d"
                    values="M50 50 C58 36 74 12 88 20 C102 28 90 44 72 48 C62 50 54 50 50 50;M50 50 C54 42 62 34 66 38 C70 42 62 48 50 50;M50 50 C58 36 74 12 88 20 C102 28 90 44 72 48 C62 50 54 50 50 50"
                    dur="0.35s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <path d="M50 50 C56 38 70 18 82 24 C92 30 84 42 70 47 C60 49 53 50 50 50" fill={b.wingInner} opacity="0.55">
                {isFlapping && (
                  <animate
                    attributeName="d"
                    values="M50 50 C56 38 70 18 82 24 C92 30 84 42 70 47 C60 49 53 50 50 50;M50 50 C53 44 60 36 63 39 C66 42 58 48 50 50;M50 50 C56 38 70 18 82 24 C92 30 84 42 70 47 C60 49 53 50 50 50"
                    dur="0.35s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <ellipse cx="76" cy="28" rx="6" ry="5" fill={b.spot} opacity="0.5" />
              <ellipse cx="76" cy="28" rx="3" ry="2.5" fill={b.wingTip} opacity="0.4" />
              <circle cx="82" cy="36" r="2.5" fill={b.spot} opacity="0.4" />
              <circle cx="68" cy="24" r="1.5" fill={b.spot} opacity="0.3" />
              <path d="M50 50 C58 38 72 22 84 24" stroke={b.body} strokeWidth="0.4" fill="none" opacity="0.15" />
              <path d="M50 50 C56 40 66 30 78 32" stroke={b.body} strokeWidth="0.3" fill="none" opacity="0.1" />
              <path d="M50 50 C58 36 74 12 88 20" stroke={b.wingTip} strokeWidth="0.5" fill="none" opacity="0.2" />

              {/* ======= RIGHT LOWER WING ======= */}
              <path d="M50 50 C60 58 76 72 84 64 C92 56 80 46 64 48 C56 49 52 50 50 50" fill={b.wing} opacity="0.75">
                {isFlapping && (
                  <animate
                    attributeName="d"
                    values="M50 50 C60 58 76 72 84 64 C92 56 80 46 64 48 C56 49 52 50 50 50;M50 50 C54 54 62 56 64 54 C66 52 58 50 50 50;M50 50 C60 58 76 72 84 64 C92 56 80 46 64 48 C56 49 52 50 50 50"
                    dur="0.35s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <ellipse cx="72" cy="60" rx="4" ry="3" fill={b.spot} opacity="0.35" />
              <path d="M50 50 C58 56 72 64 80 60" stroke={b.body} strokeWidth="0.3" fill="none" opacity="0.1" />

              {/* ======= BODY ======= */}
              {/* Abdomen */}
              <ellipse cx="50" cy="52" rx="2.5" ry="8" fill={b.body} opacity="0.85" />
              {/* Thorax */}
              <ellipse cx="50" cy="46" rx="2.8" ry="4" fill={b.body} opacity="0.9" />
              {/* Head */}
              <circle cx="50" cy="40" r="3" fill={b.body} opacity="0.9" />
              {/* Eyes */}
              <circle cx="48.5" cy="39" r="0.8" fill={b.spot} opacity="0.8" />
              <circle cx="51.5" cy="39" r="0.8" fill={b.spot} opacity="0.8" />
              {/* Tiny body highlight */}
              <ellipse cx="50" cy="45" rx="1" ry="3" fill={b.wingInner} opacity="0.2" />

              {/* ======= ANTENNAE ======= */}
              <path d="M49 38 C46 30 42 22 38 17" stroke={b.body} strokeWidth="0.7" fill="none" opacity="0.7" strokeLinecap="round" />
              <path d="M51 38 C54 30 58 22 62 17" stroke={b.body} strokeWidth="0.7" fill="none" opacity="0.7" strokeLinecap="round" />
              {/* Clubbed tips */}
              <circle cx="38" cy="17" r="1.8" fill={b.wing} opacity="0.7" />
              <circle cx="62" cy="17" r="1.8" fill={b.wing} opacity="0.7" />

              {/* Abdomen tip */}
              <ellipse cx="50" cy="60" rx="1.5" ry="2" fill={b.body} opacity="0.6" />
            </svg>
          </div>
        )
      })}
    </div>
  )
}
