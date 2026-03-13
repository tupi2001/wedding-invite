"use client"

import { useEffect, useRef, useState } from "react"

interface ArabesqueFrameProps {
  className?: string
  color?: string
  opacity?: number
  animate?: boolean
}

export function ArabesqueFrame({
  className = "",
  color = "#c8a96e",
  opacity = 0.25,
  animate = true,
}: ArabesqueFrameProps) {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(!animate)

  useEffect(() => {
    if (!animate) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDrawn(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animate])

  const pathStyle = animate
    ? {
        strokeDasharray: 1000,
        strokeDashoffset: drawn ? 0 : 1000,
        transition: "stroke-dashoffset 2.5s ease-out",
      }
    : {}

  return (
    <svg
      ref={ref}
      className={`pointer-events-none ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Top-left corner */}
      <g>
        <path
          d="M0 60 Q0 0 60 0"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          style={pathStyle}
        />
        <path
          d="M10 50 Q10 10 50 10"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          style={pathStyle}
        />
        {/* Arabesque leaf motif */}
        <path
          d="M30 0 C35 8 28 16 20 12 C12 8 18 0 30 0Z"
          fill={color}
          opacity="0.4"
        />
        <path
          d="M0 30 C8 35 16 28 12 20 C8 12 0 18 0 30Z"
          fill={color}
          opacity="0.4"
        />
        <circle cx="15" cy="15" r="2.5" fill={color} opacity="0.3" />
      </g>

      {/* Top-right corner */}
      <g transform="translate(400, 0) scale(-1, 1)">
        <path
          d="M0 60 Q0 0 60 0"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          style={pathStyle}
        />
        <path
          d="M10 50 Q10 10 50 10"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          style={pathStyle}
        />
        <path
          d="M30 0 C35 8 28 16 20 12 C12 8 18 0 30 0Z"
          fill={color}
          opacity="0.4"
        />
        <path
          d="M0 30 C8 35 16 28 12 20 C8 12 0 18 0 30Z"
          fill={color}
          opacity="0.4"
        />
        <circle cx="15" cy="15" r="2.5" fill={color} opacity="0.3" />
      </g>

      {/* Bottom-left corner */}
      <g transform="translate(0, 400) scale(1, -1)">
        <path
          d="M0 60 Q0 0 60 0"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          style={pathStyle}
        />
        <path
          d="M10 50 Q10 10 50 10"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          style={pathStyle}
        />
        <path
          d="M30 0 C35 8 28 16 20 12 C12 8 18 0 30 0Z"
          fill={color}
          opacity="0.4"
        />
        <path
          d="M0 30 C8 35 16 28 12 20 C8 12 0 18 0 30Z"
          fill={color}
          opacity="0.4"
        />
        <circle cx="15" cy="15" r="2.5" fill={color} opacity="0.3" />
      </g>

      {/* Bottom-right corner */}
      <g transform="translate(400, 400) scale(-1, -1)">
        <path
          d="M0 60 Q0 0 60 0"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          style={pathStyle}
        />
        <path
          d="M10 50 Q10 10 50 10"
          stroke={color}
          strokeWidth="0.8"
          fill="none"
          style={pathStyle}
        />
        <path
          d="M30 0 C35 8 28 16 20 12 C12 8 18 0 30 0Z"
          fill={color}
          opacity="0.4"
        />
        <path
          d="M0 30 C8 35 16 28 12 20 C8 12 0 18 0 30Z"
          fill={color}
          opacity="0.4"
        />
        <circle cx="15" cy="15" r="2.5" fill={color} opacity="0.3" />
      </g>

      {/* Top edge ornament */}
      <path
        d="M120 0 C140 12 160 12 180 5 C195 0 205 0 220 5 C240 12 260 12 280 0"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        style={pathStyle}
      />
      <circle cx="200" cy="6" r="3" fill={color} opacity="0.3" />

      {/* Bottom edge ornament */}
      <path
        d="M120 400 C140 388 160 388 180 395 C195 400 205 400 220 395 C240 388 260 388 280 400"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        style={pathStyle}
      />
      <circle cx="200" cy="394" r="3" fill={color} opacity="0.3" />

      {/* Left edge ornament */}
      <path
        d="M0 150 C12 170 12 190 5 210 C0 220 0 230 12 250"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        style={pathStyle}
      />

      {/* Right edge ornament */}
      <path
        d="M400 150 C388 170 388 190 395 210 C400 220 400 230 388 250"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        style={pathStyle}
      />
    </svg>
  )
}

export function ArabesqueDivider({
  color = "#c8a96e",
  className = "",
}: {
  color?: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
        <path
          d="M0 10 C10 2 20 2 30 10 C40 18 50 18 60 10"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M5 10 C15 4 25 4 30 10 C35 16 45 16 55 10"
          stroke={color}
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />
      </svg>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill={color} opacity="0.3" />
        <circle cx="8" cy="8" r="2" fill={color} opacity="0.4" />
      </svg>
      <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
        <path
          d="M0 10 C10 18 20 18 30 10 C40 2 50 2 60 10"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M5 10 C15 16 25 16 30 10 C35 4 45 4 55 10"
          stroke={color}
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
        />
      </svg>
    </div>
  )
}
