"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface EnvelopeProps {
  onOpen: () => void
}

export function Envelope({ onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed")

  const handleSealClick = useCallback(() => {
    if (isOpening) return
    setIsOpening(true)
    setStage("opening")
    setTimeout(() => setStage("open"), 1200)
    setTimeout(() => onOpen(), 1800)
  }, [isOpening, onOpen])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-white px-4" style={{ zIndex: 9999 }}>
      {/* Header text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: stage === "closed" ? 1 : 0, y: stage === "closed" ? 0 : -20 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <p className="font-script text-2xl italic" style={{ color: "#5a5a5a", fontFamily: "var(--font-script), cursive" }}>
          The most important day of
        </p>
        <p className="font-script text-2xl italic" style={{ color: "#5a5a5a", fontFamily: "var(--font-script), cursive" }}>
          our lives has arrived.
        </p>
        <p className="mt-2 font-sans text-xs tracking-[0.3em] uppercase" style={{ color: "#5a5a5a" }}>
          WE'RE GETTING MARRIED!
        </p>
      </motion.div>

      {/* Envelope container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: stage === "closed" ? 1 : 1.05,
          opacity: stage === "closed" ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
        style={{
          width: "min(85vw, 380px)",
          aspectRatio: "1.6 / 1",
        }}
      >
        {/* Envelope body */}
        <div
          className="absolute inset-0 rounded-lg shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #fdfcf9 0%, #f8f6f3 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Envelope flap - triangular with fold lines */}
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden"
            animate={stage === "opening" ? { rotateX: -120, originY: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
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
            
            {/* Top triangle flap */}
            <div
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

          {/* Wax seal button - no border, no wrapper, just the image */}
          <AnimatePresence>
            {stage === "closed" && (
              <motion.button
                onClick={handleSealClick}
                disabled={isOpening}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none border-0 p-0 bg-transparent z-10 w-[clamp(70px,18vw,90px)] h-[clamp(70px,18vw,90px)]"
                aria-label="Open envelope"
                type="button"
              >
                <Image
                  src="/Seal Picture.png"
                  alt="Wax seal - tap to open"
                  width={90}
                  height={90}
                  className="w-full h-full object-contain"
                  priority
                  unoptimized={false}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* "Tap the seal to open" - clearly below the seal, fully visible */}
          <AnimatePresence>
            {stage === "closed" && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-x-0 flex justify-center pointer-events-none"
                style={{ bottom: "8%", zIndex: 5 }}
              >
                <p className="font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase font-medium" style={{ color: "#4a4a4a" }}>
                  TAP THE SEAL TO OPEN
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Letter that slides out */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={stage === "opening" || stage === "open" ? { y: "-20%", opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="absolute inset-x-0 top-0 rounded-lg shadow-xl pointer-events-none"
          style={{
            height: "110%",
            background: "#fdfcf9",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center justify-center h-full">
            <p className="font-script text-2xl" style={{ color: "#7a7a7a", fontFamily: "var(--font-script), cursive" }}>
              Opening...
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Names below envelope */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: stage === "closed" ? 1 : 0, y: stage === "closed" ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 text-center"
      >
        <p className="font-script text-3xl" style={{ color: "#5a5a5a", fontFamily: "var(--font-script), cursive" }}>
          Nada & Karim
        </p>
      </motion.div>
    </div>
  )
}
