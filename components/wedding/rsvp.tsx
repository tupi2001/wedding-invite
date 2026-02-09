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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [attending, setAttending] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [guests, setGuests] = useState("1")
  const [dietary, setDietary] = useState("")
  const [message, setMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    setFieldErrors({})

    // Client-side validation
    const errors: Record<string, string> = {}

    if (attending === "Joyfully Accept") {
      if (!name.trim()) {
        errors.name = "Please enter your name"
      }
      if (!email.trim()) {
        errors.email = "Please enter your email"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address"
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          attending,
          guests,
          dietary,
          message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit RSVP")
      }

      setSubmitted(true)
    } catch (error) {
      console.error("RSVP submission error:", error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
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
          <p className="font-serif text-sm tracking-[0.2em] uppercase mt-3" style={{ color: "#666" }}>
            {"Kindly respond by 1st April 2026"}
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
              {attending === "Regretfully Decline" ? "We'll Miss You!" : "Thank You!"}
            </h3>
            <p className="font-sans text-sm mt-2 px-6" style={{ color: "#666" }}>
              {attending === "Regretfully Decline"
                ? "Thank you for letting us know. We hope to celebrate with you another time!"
                : "Your response has been recorded. We can't wait to celebrate with you!"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            {/* Attendance - moved to top for conditional logic */}
            <div
              className={`transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className="font-serif text-sm mb-3" style={{ color: "#555" }} id="attendance-label">
                {"Will you be attending?"}
              </p>
              <div className="flex gap-3" role="radiogroup" aria-labelledby="attendance-label">
                {["Joyfully Accept", "Regretfully Decline"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAttending(option)}
                    role="radio"
                    aria-checked={attending === option}
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

            {/* Decline message - shown when guest declines */}
            {attending === "Regretfully Decline" && (
              <div
                className="text-center py-8 rounded-2xl"
                style={{
                  background: "rgba(176,141,152,0.06)",
                  animation: "fade-in-up 0.5s ease-out"
                }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
                  style={{ background: "rgba(176,141,152,0.1)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      stroke="#b08d98"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
                <p className="font-serif text-lg" style={{ color: "#2a2a2a" }}>
                  {"Sorry you won't be able to make it"}
                </p>
                <p className="font-sans text-sm mt-2 px-6" style={{ color: "#666" }}>
                  {"We understand and appreciate you letting us know."}
                </p>
              </div>
            )}

            {/* Name - only shown when accepting */}
            {attending === "Joyfully Accept" && (
              <div style={{ animation: "fade-in-up 0.5s ease-out" }}>
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
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.name ? "#dc2626" : inputStyle.borderColor,
                  }}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-xs mt-1" style={{ color: "#dc2626" }}>
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email - only shown when accepting */}
            {attending === "Joyfully Accept" && (
              <div style={{ animation: "fade-in-up 0.5s ease-out 0.05s backwards" }}>
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
                  style={{
                    ...inputStyle,
                    borderColor: fieldErrors.email ? "#dc2626" : inputStyle.borderColor,
                  }}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="text-xs mt-1" style={{ color: "#dc2626" }}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            )}

            {/* Guest count - only shown when accepting */}
            {attending === "Joyfully Accept" && (
              <div style={{ animation: "fade-in-up 0.5s ease-out 0.1s backwards" }}>
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

            {/* Dietary - only shown when accepting */}
            {attending === "Joyfully Accept" && (
              <div style={{ animation: "fade-in-up 0.5s ease-out 0.15s backwards" }}>
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

            {/* Message - only shown when accepting */}
            {attending === "Joyfully Accept" && (
              <div style={{ animation: "fade-in-up 0.5s ease-out 0.2s backwards" }}>
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
            )}

            {/* Error message */}
            {submitError && (
              <div
                className="text-center py-3 px-4 rounded-xl"
                style={{
                  background: "rgba(220, 38, 38, 0.1)",
                  border: "1px solid rgba(220, 38, 38, 0.2)",
                }}
              >
                <p className="font-sans text-sm" style={{ color: "#dc2626" }}>
                  {submitError}
                </p>
              </div>
            )}

            {/* Submit - shown for both accept and decline */}
            {attending && (
              <div style={{ animation: "fade-in-up 0.5s ease-out 0.25s backwards" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full font-serif text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: attending === "Regretfully Decline"
                      ? "linear-gradient(135deg, #9a9a9a, #7a7a7a)"
                      : "linear-gradient(135deg, #b08d98, #9a7a85)",
                    color: "#fff",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    attending === "Regretfully Decline" ? "Send Response" : "Send RSVP"
                  )}
                </button>
              </div>
            )}
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
          <p className="font-sans text-xs tracking-[0.15em] mt-2" style={{ color: "#c4b0b6" }}>
            {"22.05.2026"}
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
