"use client"

import { useState, useEffect, useRef, type FormEvent } from "react"

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    const el = ref.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [])

  return { ref, isVisible }
}

export function RSVP() {
  const { ref, isVisible } = useScrollReveal()
  const [submitted, setSubmitted] = useState(false)
  const [attending, setAttending] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [guests, setGuests] = useState("1")
  const [dietary, setDietary] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.9)",
    borderColor: "#d8c8ce",
    color: "#2a2a2a",
  }

  return (
    <section
      ref={ref}
      id="rsvp"
      className="relative w-full py-20 px-6"
      style={{
        background: "linear-gradient(180deg, #fff 0%, #fef7f8 50%, #fdf2f4 100%)",
      }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Decorative rings */}
          <div className="flex justify-center mb-4" aria-hidden="true">
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
              <circle cx="14" cy="15" r="10" stroke="#b08d98" strokeWidth="1.5" fill="none" />
              <circle cx="26" cy="15" r="10" stroke="#b08d98" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <h2 className="font-script text-4xl" style={{ color: "#2a2a2a" }}>
            {"RSVP"}
          </h2>
          <p className="font-serif text-sm tracking-[0.1em] mt-3" style={{ color: "#999" }}>
            {"Please let us know if you can make it"}
          </p>
        </div>

        {submitted ? (
          <div
            className="mt-12 text-center py-12 rounded-2xl"
            style={{ background: "rgba(176,141,152,0.06)" }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: "rgba(176,141,152,0.1)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#b08d98"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold" style={{ color: "#2a2a2a" }}>
              {"Thank You!"}
            </h3>
            <p className="font-sans text-sm mt-2 px-6" style={{ color: "#999" }}>
              {"Your response has been recorded. We can't wait to celebrate with you!"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            {/* Name */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <label
                htmlFor="rsvp-name"
                className="font-serif text-sm block mb-2"
                style={{ color: "#555" }}
              >
                {"Full Name"}
              </label>
              <input
                id="rsvp-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(176,141,152,0.2)]"
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <label
                htmlFor="rsvp-email"
                className="font-serif text-sm block mb-2"
                style={{ color: "#555" }}
              >
                {"Email"}
              </label>
              <input
                id="rsvp-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(176,141,152,0.2)]"
                style={inputStyle}
              />
            </div>

            {/* Attendance */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <p className="font-serif text-sm mb-3" style={{ color: "#555" }}>
                {"Will you be attending?"}
              </p>
              <div className="flex gap-3">
                {["Joyfully Accept", "Regretfully Decline"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAttending(option)}
                    className="flex-1 py-3 px-4 rounded-xl font-sans text-sm border transition-all duration-300"
                    style={{
                      background: attending === option ? "#b08d98" : "rgba(255,255,255,0.9)",
                      color: attending === option ? "#fff" : "#555",
                      borderColor: attending === option ? "#b08d98" : "#d8c8ce",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Guest count */}
            {attending === "Joyfully Accept" && (
              <div style={{ animation: "fade-in-up 0.5s ease-out" }}>
                <label
                  htmlFor="rsvp-guests"
                  className="font-serif text-sm block mb-2"
                  style={{ color: "#555" }}
                >
                  {"Number of Guests"}
                </label>
                <select
                  id="rsvp-guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(176,141,152,0.2)]"
                  style={inputStyle}
                >
                  <option value="1">{"1 Guest"}</option>
                  <option value="2">{"2 Guests"}</option>
                  <option value="3">{"3 Guests"}</option>
                  <option value="4">{"4 Guests"}</option>
                </select>
              </div>
            )}

            {/* Dietary */}
            {attending === "Joyfully Accept" && (
              <div style={{ animation: "fade-in-up 0.5s ease-out 0.1s backwards" }}>
                <label
                  htmlFor="rsvp-dietary"
                  className="font-serif text-sm block mb-2"
                  style={{ color: "#555" }}
                >
                  {"Dietary Requirements"}
                </label>
                <input
                  id="rsvp-dietary"
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="Any allergies or dietary needs"
                  className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(176,141,152,0.2)]"
                  style={inputStyle}
                />
              </div>
            )}

            {/* Message */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <label
                htmlFor="rsvp-message"
                className="font-serif text-sm block mb-2"
                style={{ color: "#555" }}
              >
                {"Leave us a message"}
              </label>
              <textarea
                id="rsvp-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We'd love to hear from you..."
                className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(176,141,152,0.2)] resize-none"
                style={inputStyle}
              />
            </div>

            {/* Submit */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <button
                type="submit"
                className="w-full py-3.5 rounded-full font-serif text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #b08d98, #9a7a85)",
                  color: "#fff",
                }}
              >
                {"Send RSVP"}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div
          className={`mt-16 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
            <div className="w-16 h-px" style={{ background: "#d8c8ce" }} />
            {/* Tiny flower */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse
                  key={angle}
                  cx={10 + Math.cos((angle * Math.PI) / 180) * 4}
                  cy={10 + Math.sin((angle * Math.PI) / 180) * 4}
                  rx="3"
                  ry="2"
                  fill="#c8b0b8"
                  opacity="0.5"
                  transform={`rotate(${angle} ${10 + Math.cos((angle * Math.PI) / 180) * 4} ${10 + Math.sin((angle * Math.PI) / 180) * 4})`}
                />
              ))}
              <circle cx="10" cy="10" r="2" fill="#b08d98" opacity="0.4" />
            </svg>
            <div className="w-16 h-px" style={{ background: "#d8c8ce" }} />
          </div>
          <p className="font-script text-2xl" style={{ color: "#b08d98" }}>
            {"Nada & Karim"}
          </p>
          <p className="font-sans text-xs tracking-[0.1em] mt-2" style={{ color: "#c4b0b6" }}>
            {"22nd May 2026"}
          </p>
          <p
            className="font-sans text-[10px] tracking-[0.15em] uppercase mt-8"
            style={{ color: "#d0c4c8" }}
          >
            {"Made with love"}
          </p>
        </div>
      </div>
    </section>
  )
}
