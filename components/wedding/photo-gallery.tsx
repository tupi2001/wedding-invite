"use client"

import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { useLanguage } from "@/context/language-context"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { ArabesqueDivider } from "./arabesque-frame"

interface Photo {
  src: string
  alt: string
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const { t, lang } = useLanguage()
  const { ref, isVisible } = useScrollReveal(0.1)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showSwipeHint, setShowSwipeHint] = useState(true)

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setShowSwipeHint(false)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    return () => { emblaApi.off("select", onSelect) }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!showSwipeHint) return
    const timer = setTimeout(() => setShowSwipeHint(false), 4000)
    return () => clearTimeout(timer)
  }, [showSwipeHint])

  if (photos.length === 0) return null

  return (
    <section
      ref={ref}
      className="relative w-full py-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f5f0ea 0%, #fff 30%, #fff 70%, #f8f5f0 100%)",
      }}
    >
      <div className="relative z-10 max-w-2xl mx-auto px-6">
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
                key={photo.src}
                className="flex-shrink-0 px-3"
                style={{ flexBasis: "75%", maxWidth: "380px" }}
              >
                <div
                  className="rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    boxShadow: selectedIndex === idx
                      ? "0 28px 70px rgba(0,0,0,0.12), 0 12px 32px rgba(200,169,110,0.12)"
                      : "0 8px 24px rgba(0,0,0,0.06)",
                    transform: selectedIndex === idx ? "scale(1)" : "scale(0.92)",
                    opacity: selectedIndex === idx ? 1 : 0.5,
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={380}
                    height={480}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {photos.map((photo, idx) => (
            <button
              key={photo.src}
              onClick={() => scrollTo(idx)}
              className="transition-all duration-300"
              style={{
                width: selectedIndex === idx ? 32 : 8,
                height: 10,
                borderRadius: 5,
                background: selectedIndex === idx
                  ? "linear-gradient(90deg, #c8a96e, #b89a5e)"
                  : "rgba(200,169,110,0.3)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-label={`Go to photo ${idx + 1}`}
              type="button"
            />
          ))}
        </div>

        {showSwipeHint && photos.length > 1 && (
          <p
            className={`text-center mt-4 text-xs transition-opacity duration-500 ${lang === "ar" ? "font-arabic" : "font-sans"}`}
            style={{ color: "#c8a96e80" }}
          >
            {lang === "ar" ? "اسحب لرؤية المزيد" : "Swipe to see more"}
          </p>
        )}
      </div>
    </section>
  )
}
