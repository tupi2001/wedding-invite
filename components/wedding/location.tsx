"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  return { ref, isVisible }
}

// Venue configuration - update these values with your actual venue details
const VENUE_CONFIG = {
  name: "The Royal Ballroom",
  venue: "Four Seasons Hotel Cairo at Nile Plaza",
  address: "1089 Corniche El Nil, Garden City",
  city: "Cairo, Egypt",
  coordinates: {
    lat: 30.0392,
    lng: 31.2290,
  },
  date: "Friday, the twenty-second of May, two thousand twenty-six",
  time: "Five o'clock in the evening",
  googleMapsQuery: "Four+Seasons+Hotel+Cairo+at+Nile+Plaza",
  // Google Maps embed URL - get this from Google Maps > Share > Embed
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.8!2d31.2290!3d30.0392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c5a7e8e8e7%3A0x8e8e8e8e8e8e8e8e!2sFour%20Seasons%20Hotel%20Cairo%20at%20Nile%20Plaza!5e0!3m2!1sen!2seg!4v1",
}

export function Location() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      ref={ref}
      id="location"
      className="relative w-full py-20 px-6"
      style={{ background: "#fff" }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex justify-center mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(176,141,152,0.1)" }}
            >
              <MapPin size={18} style={{ color: "#b08d98" }} />
            </div>
          </div>
          <h2 className="font-script text-4xl" style={{ color: "#2a2a2a" }}>
            {"Location"}
          </h2>
        </div>

        {/* Venue Details */}
        <div
          className={`mt-8 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <h3 className="font-serif text-xl font-semibold" style={{ color: "#2a2a2a" }}>
            {VENUE_CONFIG.name}
          </h3>
          <p className="font-sans text-sm mt-2" style={{ color: "#666" }}>
            {VENUE_CONFIG.venue}
          </p>
          <p className="font-sans text-sm" style={{ color: "#666" }}>
            {VENUE_CONFIG.address}
          </p>
          <p className="font-sans text-sm" style={{ color: "#666" }}>
            {VENUE_CONFIG.city}
          </p>
        </div>

        {/* Date & Time */}
        <div
          className={`mt-6 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "250ms" }}
        >
          <div
            className="inline-block py-3 px-6 rounded-xl"
            style={{ background: "rgba(176,141,152,0.08)" }}
          >
            <p className="font-serif text-sm font-medium" style={{ color: "#b08d98" }}>
              {VENUE_CONFIG.date}
            </p>
            <p className="font-sans text-xs mt-1" style={{ color: "#666" }}>
              {VENUE_CONFIG.time}
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div
          className={`flex items-center justify-center gap-2 mt-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#c4b0b6" strokeWidth="1.5" />
            <path d="M12 2v20M2 12h20" stroke="#c4b0b6" strokeWidth="1" />
          </svg>
          <span className="font-sans text-xs" style={{ color: "#c4b0b6" }}>
            {`${VENUE_CONFIG.coordinates.lat.toFixed(4)}° N, ${VENUE_CONFIG.coordinates.lng.toFixed(4)}° E`}
          </span>
        </div>

        {/* Map Embed */}
        <div
          className={`mt-8 rounded-xl overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{
            transitionDelay: "400ms",
            boxShadow: "0 4px 20px rgba(176,141,152,0.1)",
          }}
        >
          <div className="relative w-full" style={{ paddingBottom: "60%" }}>
            <iframe
              title="Wedding venue location"
              src={VENUE_CONFIG.embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`mt-6 flex flex-col gap-3 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <a
            href={`https://maps.google.com/?q=${VENUE_CONFIG.googleMapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-full font-sans text-sm tracking-wide transition-all duration-300 hover:shadow-md"
            style={{
              background: "#b08d98",
              color: "#fff",
            }}
          >
            <MapPin size={14} />
            {"Open in Maps"}
          </a>
          <a
            href={`https://maps.google.com/?q=${VENUE_CONFIG.googleMapsQuery}&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-6 rounded-full font-sans text-sm tracking-wide border transition-all duration-300 hover:shadow-md"
            style={{
              borderColor: "#d8c8ce",
              color: "#b08d98",
              background: "transparent",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
            {"Get Directions"}
          </a>
        </div>
      </div>
    </section>
  )
}
