"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface EnvelopeProps {
  onOpen: () => void
}

// Custom easing functions for elegant animations
const elegantEasing = [0.43, 0.13, 0.23, 0.96] // Custom cubic-bezier for smooth, refined motion
const softBounce = [0.34, 1.56, 0.64, 1] // Subtle overshoot for organic feel
const gentleDecelerate = [0.25, 0.1, 0.25, 1] // Smooth deceleration

export function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [stage, setStage] = useState<"closed" | "opening" | "flap-open" | "letter-rising" | "open">("closed")

  const handleSealClick = useCallback(() => {
    if (isOpening) return
    setIsOpening(true)

    // Stage 1: Seal breaks with subtle shake
    setStage("opening")

    // Stage 2: Flap opens elegantly (after seal animation)
    setTimeout(() => setStage("flap-open"), 400)

    // Stage 3: Letter rises gracefully
    setTimeout(() => setStage("letter-rising"), 1000)

    // Stage 4: Complete and transition
    setTimeout(() => setStage("open"), 1800)
    setTimeout(() => onOpen(), 2200)
  }, [isOpening, onOpen])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-white px-4" style={{ zIndex: 9999 }}>
      {/* Subtle ambient particles - using CSS animations for better performance */}
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }
        .ambient-particle {
          animation: float-particle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full ambient-particle"
            style={{
              background: "rgba(176, 141, 152, 0.3)",
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              "--duration": `${3 + i * 0.5}s`,
              "--delay": `${i * 0.3}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Header text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: stage === "closed" ? 1 : 0,
          y: stage === "closed" ? 0 : -30,
          scale: stage === "closed" ? 1 : 0.95,
        }}
        transition={{ duration: 0.8, ease: elegantEasing }}
        className="mb-8 text-center"
      >
        <motion.p
          className="font-serif text-xs tracking-[0.25em] uppercase"
          style={{ color: "#666" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Together with their families
        </motion.p>
        <motion.p
          className="font-script text-3xl mt-3"
          style={{ color: "#5a5a5a", fontFamily: "var(--font-script), cursive" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Nada & Karim
        </motion.p>
        <motion.p
          className="mt-3 font-serif text-xs tracking-[0.2em] uppercase"
          style={{ color: "#666" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          Request the pleasure of your company
        </motion.p>
      </motion.div>

      {/* Envelope container */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{
          scale: stage === "closed" ? 1 : stage === "opening" ? 1.02 : 1.05,
          opacity: stage === "open" ? 0 : 1,
          y: stage === "closed" ? 0 : stage === "open" ? -20 : 0,
        }}
        transition={{
          duration: 1,
          ease: elegantEasing,
          opacity: { duration: 0.6, delay: stage === "open" ? 0.2 : 0 }
        }}
        className="relative"
        style={{
          width: "min(85vw, 380px)",
          aspectRatio: "1.6 / 1",
          perspective: "1000px",
        }}
      >
        {/* Envelope body with enhanced shadow */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{
            boxShadow: stage === "closed"
              ? "0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)"
              : "0 30px 80px rgba(0,0,0,0.2), 0 15px 30px rgba(0,0,0,0.12)",
          }}
          transition={{ duration: 0.6, ease: gentleDecelerate }}
          style={{
            background: "linear-gradient(135deg, #fdfcf9 0%, #f8f6f3 100%)",
          }}
        >
          {/* Envelope flap - triangular with fold lines */}
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden origin-top"
            animate={{
              rotateX: stage === "flap-open" || stage === "letter-rising" || stage === "open" ? -160 : 0,
            }}
            transition={{
              duration: 0.8,
              ease: elegantEasing,
            }}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "top center",
            }}
          >
            {/* Diagonal fold lines forming X */}
            <div
              className="absolute"
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: "50%",
                background: "linear-gradient(135deg, transparent 49.5%, rgba(0,0,0,0.12) 49.5%, rgba(0,0,0,0.12) 50.5%, transparent 50.5%)",
              }}
            />
            <div
              className="absolute"
              style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: "50%",
                background: "linear-gradient(-135deg, transparent 49.5%, rgba(0,0,0,0.12) 49.5%, rgba(0,0,0,0.12) 50.5%, transparent 50.5%)",
              }}
            />

            {/* Top triangle flap with subtle gradient */}
            <motion.div
              animate={{
                background: stage === "flap-open" || stage === "letter-rising" || stage === "open"
                  ? "linear-gradient(135deg, #ebe8e4 0%, #e5e2de 100%)"
                  : "linear-gradient(135deg, #f5f3f0 0%, #efece8 100%)",
              }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(135deg, #f5f3f0 0%, #efece8 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </motion.div>

          {/* Wax seal button with enhanced interactions */}
          <AnimatePresence mode="wait">
            {stage === "closed" && (
              <motion.button
                onClick={handleSealClick}
                disabled={isOpening}
                initial={{ scale: 0, rotate: -10 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  scale: 0,
                  rotate: 180,
                  opacity: 0,
                }}
                whileHover={{
                  scale: 1.08,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 18,
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none border-0 p-0 bg-transparent z-10 w-[clamp(70px,18vw,90px)] h-[clamp(70px,18vw,90px)]"
                aria-label="Open envelope"
                type="button"
              >
                {/* Subtle glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background: "radial-gradient(circle, rgba(176,141,152,0.3) 0%, transparent 70%)",
                    filter: "blur(8px)",
                    transform: "scale(1.3)",
                  }}
                />
                <Image
                  src="/Seal Picture.png"
                  alt="Wax seal - tap to open"
                  width={90}
                  height={90}
                  className="w-full h-full object-contain relative z-10"
                  priority
                  unoptimized={false}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* "Tap the seal to open" - with subtle pulse animation */}
          <AnimatePresence>
            {stage === "closed" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: gentleDecelerate }}
                className="absolute inset-x-0 flex justify-center pointer-events-none"
                style={{ bottom: "8%", zIndex: 5 }}
              >
                <motion.p
                  className="font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium"
                  style={{ color: "#4a4a4a" }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  TAP THE SEAL TO OPEN
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Letter that slides out with elegant animation */}
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.98 }}
          animate={
            stage === "letter-rising" || stage === "open"
              ? { y: "-25%", opacity: 1, scale: 1 }
              : {}
          }
          transition={{
            duration: 1,
            ease: elegantEasing,
            delay: 0.1,
          }}
          className="absolute inset-x-0 top-0 rounded-lg pointer-events-none"
          style={{
            height: "110%",
            background: "linear-gradient(180deg, #fdfcf9 0%, #f9f7f4 100%)",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3">
            {/* Decorative flourish */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={stage === "letter-rising" || stage === "open" ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6, ease: softBounce }}
            >
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none" aria-hidden="true">
                <path
                  d="M0 10 Q10 0 20 10 Q30 20 40 10"
                  stroke="rgba(176,141,152,0.4)"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </motion.div>
            <motion.p
              className="font-script text-2xl"
              style={{ color: "#7a7a7a", fontFamily: "var(--font-script), cursive" }}
              initial={{ opacity: 0 }}
              animate={stage === "letter-rising" || stage === "open" ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Your invitation awaits...
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Date below envelope with enhanced animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: stage === "closed" ? 1 : 0,
          y: stage === "closed" ? 0 : 30,
          scale: stage === "closed" ? 1 : 0.95,
        }}
        transition={{ duration: 0.8, delay: 0.4, ease: elegantEasing }}
        className="mt-8 text-center"
      >
        <motion.p
          className="font-serif text-base tracking-[0.2em]"
          style={{ color: "#666" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          22.05.2026
        </motion.p>
      </motion.div>
    </div>
  )
}
