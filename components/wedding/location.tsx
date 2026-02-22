"use client"

import { MapPin } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useLanguage } from "@/context/language-context"
import { ArabesqueDivider } from "./arabesque-frame"
import { weddingConfig } from "@/config/wedding"

export function Location() {
  const { ref, isVisible } = useScrollReveal()
  const { t, lang } = useLanguage()

  return (
    <section
      ref={ref}
      id="location"
      className="relative w-full py-20 px-6"
      style={{ background: "#fff" }}
    >
      <div className="max-w-md mx-auto">
        <div
          className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="flex justify-center mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(200,169,110,0.1)" }}
            >
              <MapPin size={18} style={{ color: "#c8a96e" }} />
            </div>
          </div>
          <h2
            className={`text-4xl ${lang === "ar" ? "font-arabic text-3xl" : "font-script"}`}
            style={{ color: "#2a2a2a" }}
          >
            {t("location", "title")}
          </h2>
        </div>

        <ArabesqueDivider color="#c8a96e" className="mt-4 mb-4" />

        <div
          className={`mt-6 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "200ms" }}
        >
          <h3
            className={`font-serif text-xl font-semibold ${lang === "ar" ? "font-arabic" : ""}`}
            style={{ color: "#2a2a2a" }}
          >
            {t("location", "venueName")}
          </h3>
          <p className={`font-sans text-sm mt-2 ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
            {t("location", "venue")}
          </p>
          <p className={`font-sans text-sm ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
            {t("location", "address")}
          </p>
          <p className={`font-sans text-sm ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
            {t("location", "city")}
          </p>
        </div>

        <div
          className={`flex items-center justify-center gap-2 mt-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#c8a96e" strokeWidth="1.5" opacity="0.5" />
            <path d="M12 2v20M2 12h20" stroke="#c8a96e" strokeWidth="1" opacity="0.3" />
          </svg>
          <span className="font-sans text-xs" style={{ color: "#c8a96e80" }}>
            {`${weddingConfig.venue.coordinates.lat.toFixed(4)}° N, ${weddingConfig.venue.coordinates.lng.toFixed(4)}° E`}
          </span>
        </div>

        <div
          className={`mt-8 rounded-xl overflow-hidden transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "400ms", boxShadow: "0 4px 20px rgba(200,169,110,0.1)" }}
        >
          <div className="relative w-full" style={{ paddingBottom: "60%" }}>
            <iframe
              title="Wedding venue location"
              src={weddingConfig.venue.embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div
          className={`mt-6 flex flex-col gap-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "500ms" }}
        >
          <a
            href={`https://maps.google.com/?q=${weddingConfig.venue.googleMapsQuery}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-full font-sans text-sm tracking-wide border transition-all duration-300 hover:shadow-md ${lang === "ar" ? "font-arabic" : ""}`}
            style={{ borderColor: "#c8a96e60", color: "#c8a96e", background: "transparent" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            {t("location", "getDirections")}
          </a>
        </div>
      </div>
    </section>
  )
}
