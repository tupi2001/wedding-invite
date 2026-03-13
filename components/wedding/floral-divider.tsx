interface FloralDividerProps {
  lineColor?: string
  petalColor?: string
  centerColor?: string
  lineWidth?: number
  className?: string
}

export function FloralDivider({
  lineColor = "#ddd5ca",
  petalColor = "#c4b0b6",
  centerColor = "#5a6b50",
  lineWidth = 16,
  className = "",
}: FloralDividerProps) {
  return (
    <div
      className={`flex items-center justify-center py-8 ${className}`}
      aria-hidden="true"
    >
      <div className="w-16 h-px" style={{ background: lineColor }} />
      <div className="mx-4">
        <svg
          width={lineWidth}
          height={lineWidth}
          viewBox={`0 0 ${lineWidth} ${lineWidth}`}
          fill="none"
        >
          {[0, 72, 144, 216, 288].map((angle) => {
            const half = lineWidth / 2
            const r = lineWidth * 0.21
            return (
              <ellipse
                key={angle}
                cx={half + Math.cos((angle * Math.PI) / 180) * r}
                cy={half + Math.sin((angle * Math.PI) / 180) * r}
                rx={lineWidth * 0.14}
                ry={lineWidth * 0.1}
                fill={petalColor}
                opacity="0.35"
                transform={`rotate(${angle} ${half + Math.cos((angle * Math.PI) / 180) * r} ${half + Math.sin((angle * Math.PI) / 180) * r})`}
              />
            )
          })}
          <circle
            cx={lineWidth / 2}
            cy={lineWidth / 2}
            r={lineWidth * 0.085}
            fill={centerColor}
            opacity="0.3"
          />
        </svg>
      </div>
      <div className="w-16 h-px" style={{ background: lineColor }} />
    </div>
  )
}
