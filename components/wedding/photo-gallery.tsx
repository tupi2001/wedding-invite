"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { useLanguage } from "@/context/language-context"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { ArabesqueDivider } from "./arabesque-frame"
import { weddingConfig } from "@/config/wedding"

const photos = weddingConfig.gallery

export function PhotoGallery() {
  const { t, lang } = useLanguage()
  const { ref, isVisible } = useScrollReveal(0.1)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useState(() => {
    if (emblaApi) emblaApi.on("select", onSelect)
  })

  return (
    <section
      ref={ref}
      className="relative w-full py-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f5f0ea 0%, #fff 30%, #fff 70%, #f8f5f0 100%)",
      }}
    >
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        {/* Header */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            className={`font-script text-4xl ${lang === "ar" ? "font-arabic text-3xl" : ""}`}
            style={{ color: "#2a2a2a" }}
          >
            {t("gallery", "title")}
          </h2>
          <p
            className={`font-serif text-sm tracking-[0.2em] uppercase mt-3 ${lang === "ar" ? "font-arabic tracking-normal text-base" : ""}`}
            style={{ color: "#999" }}
          >
            {t("gallery", "subtitle")}
          </p>
        </div>

        <ArabesqueDivider color="#c8a96e" className="mt-6 mb-8" />
      </div>

      {/* Carousel */}
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "300ms" }}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 px-3"
                style={{ flexBasis: "75%", maxWidth: "380px" }}
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    boxShadow: selectedIndex === idx
                      ? "0 20px 50px rgba(0,0,0,0.12)"
                      : "0 8px 24px rgba(0,0,0,0.06)",
                    transform: selectedIndex === idx ? "scale(1)" : "scale(0.92)",
                    opacity: selectedIndex === idx ? 1 : 0.6,
                  }}
                >
                  {photo.src ? (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={380}
                      height={480}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  ) : (
                    <div
                      className="w-full aspect-[3/4] flex flex-col items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, #f0ece6, #e8e2d8, #f0ece6)",
                        border: "1px dashed #c8a96e30",
                      }}
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#c8a96e60" strokeWidth="1.5" />
                        <circle cx="8.5" cy="8.5" r="2" stroke="#c8a96e60" strokeWidth="1.2" />
                        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#c8a96e60" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                      <p className="font-sans text-xs mt-3" style={{ color: "#c8a96e80" }}>
                        {t("gallery", "placeholder")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {photos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className="transition-all duration-300"
              style={{
                width: selectedIndex === idx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: selectedIndex === idx ? "#c8a96e" : "#c8a96e40",
              }}
              aria-label={`Go to photo ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
