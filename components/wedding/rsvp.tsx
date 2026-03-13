"use client"

import { useState, useEffect, useCallback, type FormEvent } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useLanguage } from "@/context/language-context"
import { ArabesqueDivider } from "./arabesque-frame"

interface RSVPProps {
  inviteeId?: string
  maxGuests?: number
  onGroupFull?: () => void
}

interface GroupRSVP {
  id: string
  name: string
  attending: "accept" | "decline"
  message: string
  submitted_at: string
}

export function RSVP({ inviteeId, maxGuests = 4, onGroupFull }: RSVPProps) {
  const { ref, isVisible } = useScrollReveal(0.15)
  const { t, lang } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [attending, setAttending] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [groupRSVPs, setGroupRSVPs] = useState<GroupRSVP[]>([])
  const [loadingGroup, setLoadingGroup] = useState(false)

  const acceptedCount = groupRSVPs.filter((r) => r.attending === "accept").length
  const spotsRemaining = maxGuests - acceptedCount
  const isFull = spotsRemaining <= 0

  const fetchGroupRSVPs = useCallback(async () => {
    if (!inviteeId) return
    setLoadingGroup(true)
    try {
      const res = await fetch(`/api/rsvp?invitee_id=${inviteeId}`)
      if (res.ok) {
        const data = await res.json()
        setGroupRSVPs(data.responses || [])
      }
    } catch {
      // Silently fail -- form still works
    } finally {
      setLoadingGroup(false)
    }
  }, [inviteeId])

  useEffect(() => {
    fetchGroupRSVPs()
  }, [fetchGroupRSVPs])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    setFieldErrors({})

    const errors: Record<string, string> = {}
    if (!name.trim()) errors.name = t("rsvp", "validationName")

    const normalizedName = name.trim().toLowerCase()
    const alreadySubmitted = groupRSVPs.some(
      (r) => r.name.trim().toLowerCase() === normalizedName
    )
    if (alreadySubmitted) {
      errors.name = t("rsvp", "alreadyRsvpd")
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitee_id: inviteeId || null,
          name: name.trim(),
          email,
          attending,
          message,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to submit RSVP")

      setSubmitted(true)
      await fetchGroupRSVPs()

      if (onGroupFull && inviteeId && attending === "accept") {
        const res = await fetch(`/api/rsvp?invitee_id=${inviteeId}`)
        if (res.ok) {
          const freshData = await res.json()
          const newAccepted = (freshData.responses || []).filter(
            (r: { attending: string }) => r.attending === "accept"
          ).length
          if (newAccepted >= maxGuests) {
            setTimeout(() => onGroupFull(), 2000)
          }
        }
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setName("")
    setEmail("")
    setMessage("")
    setAttending("")
    setSubmitError("")
    setFieldErrors({})
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.9)",
    borderColor: "#c8a96e40",
    color: "#2a2a2a",
  }

  const confirmedGuests = groupRSVPs.filter((r) => r.attending === "accept")

  return (
    <section
      ref={ref}
      id="rsvp"
      className="relative w-full py-20 px-6 scroll-mt-24"
      style={{
        background: "linear-gradient(180deg, #fff 0%, #fdfcf9 50%, #f8f5f0 100%)",
      }}
    >
      <div className="max-w-md mx-auto">
        <div
          className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="flex justify-center mb-4" aria-hidden="true">
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
              <circle cx="14" cy="15" r="10" stroke="#c8a96e" strokeWidth="1.5" fill="none" opacity="0.5" />
              <circle cx="26" cy="15" r="10" stroke="#c8a96e" strokeWidth="1.5" fill="none" opacity="0.5" />
            </svg>
          </div>
          <h2
            className={`text-4xl ${lang === "ar" ? "font-arabic text-3xl" : "font-script"}`}
            style={{ color: "#2a2a2a" }}
          >
            {t("rsvp", "title")}
          </h2>
          <p
            className={`font-serif text-sm tracking-[0.2em] uppercase mt-3 ${lang === "ar" ? "font-arabic tracking-normal text-base" : ""}`}
            style={{ color: "#666" }}
          >
            {t("rsvp", "subtitle")}
          </p>
        </div>

        <ArabesqueDivider color="#c8a96e" className="mt-4 mb-4" />

        {/* Group status loading skeleton */}
        {inviteeId && loadingGroup && (
          <div
            className="mt-6 rounded-xl p-4 animate-pulse"
            style={{ background: "rgba(200,169,110,0.06)" }}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-[#c8a96e20] rounded" />
              <div className="h-4 w-28 bg-[#c8a96e20] rounded" />
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[#c8a96e15]" />
          </div>
        )}

        {/* Group status */}
        {inviteeId && !loadingGroup && (
          <div
            className={`mt-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.18)" }}
            >
              <div className={`flex items-center justify-between ${lang === "ar" ? "flex-row-reverse" : ""}`}>
                <span className={`font-sans text-sm ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
                  <span className="font-semibold" style={{ color: "#c8a96e" }}>{acceptedCount}</span>
                  {" "}{t("rsvp", "spotsFilled")}
                </span>
                <span className={`font-sans text-sm ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
                  <span className="font-semibold" style={{ color: isFull ? "#b08d98" : "#5a6b50" }}>
                    {spotsRemaining}
                  </span>
                  {" "}{t("rsvp", "spotsRemaining")}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(200,169,110,0.12)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((acceptedCount / maxGuests) * 100, 100)}%`,
                    background: isFull
                      ? "linear-gradient(90deg, #b08d98, #9a7a85)"
                      : "linear-gradient(90deg, #c8a96e, #b89a5e)",
                  }}
                />
              </div>
            </div>

            {/* Confirmed guest list */}
            {confirmedGuests.length > 0 && (
              <div className="mt-4">
                <p
                  className={`font-serif text-xs tracking-[0.15em] uppercase mb-3 ${lang === "ar" ? "font-arabic tracking-normal text-sm" : ""}`}
                  style={{ color: "#999" }}
                >
                  {t("rsvp", "confirmedGuests")}
                </p>
                <div className="flex flex-col gap-2">
                  {confirmedGuests.map((rsvp) => (
                    <div
                      key={rsvp.id}
                      className={`flex items-center gap-2.5 py-2 px-3 rounded-lg ${lang === "ar" ? "flex-row-reverse" : ""}`}
                      style={{ background: "rgba(90,107,80,0.05)" }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "rgba(90,107,80,0.12)" }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 13l4 4L19 7" stroke="#5a6b50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className={`font-sans text-sm ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#3a3a3a" }}>
                        {rsvp.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupRSVPs.length === 0 && (
              <p className={`mt-3 text-center font-sans text-xs ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#c8a96e80" }}>
                {t("rsvp", "noResponses")}
              </p>
            )}
          </div>
        )}

        {/* Full message */}
        {isFull && !submitted ? (
          <div
            className="mt-8 text-center py-8 rounded-2xl"
            style={{ background: "rgba(176,141,152,0.06)" }}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
              style={{ background: "rgba(176,141,152,0.1)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="#b08d98" opacity="0.5" />
                <path d="M13 7h-2v6h2V7zm0 8h-2v2h2v-2z" fill="#b08d98" opacity="0.7" />
              </svg>
            </div>
            <p className={`font-serif text-base ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#2a2a2a" }}>
              {t("rsvp", "groupFull")}
            </p>
          </div>
        ) : submitted ? (
          <div
            className="mt-8 text-center py-12 rounded-2xl"
            style={{ background: "rgba(200,169,110,0.06)" }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: "rgba(200,169,110,0.1)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="#c8a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3
              className={`font-serif text-xl font-semibold ${lang === "ar" ? "font-arabic" : ""}`}
              style={{ color: "#2a2a2a" }}
            >
              {attending === "decline" ? t("rsvp", "missYou") : t("rsvp", "thankYou")}
            </h3>
            <p className={`font-sans text-sm mt-2 px-6 ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
              {attending === "decline" ? t("rsvp", "declinedMessage") : t("rsvp", "confirmedMessage")}
            </p>

            {/* Allow another person from the group to RSVP */}
            {inviteeId && spotsRemaining > 0 && attending === "accept" && (
              <button
                type="button"
                onClick={resetForm}
                className={`mt-6 inline-block font-sans text-sm underline transition-opacity hover:opacity-70 ${lang === "ar" ? "font-arabic" : ""}`}
                style={{ color: "#c8a96e" }}
              >
                {lang === "ar" ? "إضافة شخص آخر" : "Add another person"}
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            {/* Attendance choice */}
            <div
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <p className={`font-serif text-sm mb-3 ${lang === "ar" ? "font-arabic text-base" : ""}`} style={{ color: "#555" }} id="attendance-label">
                {t("rsvp", "willYouAttend")}
              </p>
              <div className={`flex gap-3 ${lang === "ar" ? "flex-row-reverse" : ""}`} role="radiogroup" aria-labelledby="attendance-label">
                {[
                  { value: "accept", labelKey: "accept" },
                  { value: "decline", labelKey: "decline" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAttending(option.value)}
                    role="radio"
                    aria-checked={attending === option.value}
                    className={`flex-1 py-3 px-4 rounded-xl font-sans text-sm border transition-all duration-300 ${lang === "ar" ? "font-arabic" : ""}`}
                    style={{
                      background: attending === option.value
                        ? "linear-gradient(135deg, #c8a96e, #b89a5e)"
                        : "rgba(255,255,255,0.9)",
                      color: attending === option.value ? "#fff" : "#555",
                      borderColor: attending === option.value ? "#b89a5e" : "#c8a96e40",
                      boxShadow: attending === option.value ? "0 4px 12px rgba(200,169,110,0.25)" : "none",
                    }}
                  >
                    {t("rsvp", option.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Decline message */}
            {attending === "decline" && (
              <div
                className="text-center py-8 rounded-2xl"
                style={{ background: "rgba(200,169,110,0.06)", animation: "fade-in-up 0.5s ease-out" }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
                  style={{ background: "rgba(200,169,110,0.1)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      stroke="#c8a96e"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </div>
                <p className={`font-serif text-lg ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#2a2a2a" }}>
                  {t("rsvp", "declineTitle")}
                </p>
                <p className={`font-sans text-sm mt-2 px-6 ${lang === "ar" ? "font-arabic" : ""}`} style={{ color: "#666" }}>
                  {t("rsvp", "declineMessage")}
                </p>
              </div>
            )}

            {/* Form fields (shown for both accept and decline) */}
            {attending && (
              <>
                <div style={{ animation: "fade-in-up 0.5s ease-out" }}>
                  <label htmlFor="rsvp-name" className={`font-serif text-sm block mb-2 ${lang === "ar" ? "font-arabic text-base" : ""}`} style={{ color: "#555" }}>
                    {t("rsvp", "fullName")} *
                  </label>
                  <input
                    id="rsvp-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("rsvp", "namePlaceholder")}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(200,169,110,0.3)]"
                    style={{ ...inputStyle, borderColor: fieldErrors.name ? "#dc2626" : inputStyle.borderColor }}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  />
                  {fieldErrors.name && <p id="name-error" className="text-xs mt-1" style={{ color: "#dc2626" }}>{fieldErrors.name}</p>}
                </div>

                {attending === "accept" && (
                  <div style={{ animation: "fade-in-up 0.5s ease-out 0.05s backwards" }}>
                    <label htmlFor="rsvp-email" className={`font-serif text-sm block mb-2 ${lang === "ar" ? "font-arabic text-base" : ""}`} style={{ color: "#555" }}>
                      {t("rsvp", "email")}
                    </label>
                    <input
                      id="rsvp-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("rsvp", "emailPlaceholder")}
                      className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(200,169,110,0.3)]"
                      style={inputStyle}
                    />
                  </div>
                )}

                <div style={{ animation: "fade-in-up 0.5s ease-out 0.1s backwards" }}>
                  <label htmlFor="rsvp-message" className={`font-serif text-sm block mb-2 ${lang === "ar" ? "font-arabic text-base" : ""}`} style={{ color: "#555" }}>
                    {t("rsvp", "message")}
                  </label>
                  <textarea
                    id="rsvp-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("rsvp", "messagePlaceholder")}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    className="w-full py-3 px-4 rounded-xl font-sans text-sm border outline-none transition-all duration-300 focus:ring-2 focus:ring-[rgba(200,169,110,0.3)] resize-none"
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {submitError && (
              <div className="text-center py-3 px-4 rounded-xl" style={{ background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)" }}>
                <p className="font-sans text-sm" style={{ color: "#dc2626" }}>{submitError}</p>
              </div>
            )}

            {attending && (
              <div style={{ animation: "fade-in-up 0.5s ease-out 0.15s backwards" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-full font-serif text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${lang === "ar" ? "font-arabic tracking-normal text-base" : ""}`}
                  style={{
                    background: attending === "decline"
                      ? "linear-gradient(135deg, #9a9a9a, #7a7a7a)"
                      : "linear-gradient(135deg, #c8a96e, #b89a5e)",
                    color: "#fff",
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t("rsvp", "sending")}
                    </span>
                  ) : attending === "decline" ? (
                    t("rsvp", "sendResponse")
                  ) : (
                    t("rsvp", "sendRsvp")
                  )}
                </button>
              </div>
            )}
          </form>
        )}

        {/* Footer */}
        <div
          className={`mt-16 text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "800ms" }}
        >
          <ArabesqueDivider color="#c8a96e" className="mb-6" />
          <p
            className={`text-2xl ${lang === "ar" ? "font-arabic" : "font-script"}`}
            style={{ color: "#c8a96e" }}
          >
            {t("footer", "coupleNames")}
          </p>
          <p className="font-sans text-xs tracking-[0.15em] mt-2" style={{ color: "#c8a96e80" }}>
            {t("footer", "date")}
          </p>
          <p
            className={`font-sans text-[10px] tracking-[0.15em] uppercase mt-8 ${lang === "ar" ? "font-arabic tracking-normal text-xs" : ""}`}
            style={{ color: "#d0c4c8" }}
          >
            {t("footer", "madeWith")}
          </p>
        </div>
      </div>
    </section>
  )
}
