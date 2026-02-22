"use client"

import { useState, useEffect, useCallback, type FormEvent } from "react"
import type { InviteeWithRSVPs, RSVPSummary, RSVPResponse } from "@/lib/types"
import { weddingConfig } from "@/config/wedding"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [adminKey, setAdminKey] = useState("")

  const [invitees, setInvitees] = useState<InviteeWithRSVPs[]>([])
  const [summary, setSummary] = useState<RSVPSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [showAddForm, setShowAddForm] = useState(false)
  const [newNameEn, setNewNameEn] = useState("")
  const [newNameAr, setNewNameAr] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newMaxGuests, setNewMaxGuests] = useState("2")
  const [newLangPref, setNewLangPref] = useState<"en" | "ar">("en")
  const [addError, setAddError] = useState("")

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [expandedInvitee, setExpandedInvitee] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"guests" | "stats">("guests")

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    setAdminKey(password)
    setAuthenticated(true)
    setAuthError("")
  }

  const fetchData = useCallback(async () => {
    if (!adminKey) return
    setLoading(true)
    setError("")

    try {
      const headers = { Authorization: `Bearer ${adminKey}` }

      const [inviteesRes, rsvpRes] = await Promise.all([
        fetch("/api/invitees", { headers }),
        fetch(`/api/rsvp?key=${adminKey}`),
      ])

      if (inviteesRes.status === 401 || rsvpRes.status === 401) {
        setAuthenticated(false)
        setAuthError("Invalid password. Please try again.")
        setAdminKey("")
        return
      }

      const inviteesData = await inviteesRes.json()
      const rsvpData = await rsvpRes.json()

      const allResponses: RSVPResponse[] = rsvpData.responses || []
      const inviteesWithRsvps: InviteeWithRSVPs[] = (inviteesData.invitees || []).map(
        (inv: InviteeWithRSVPs) => ({
          ...inv,
          rsvps: allResponses.filter((r) => r.invitee_id === inv.id),
        })
      )

      setInvitees(inviteesWithRsvps)
      setSummary(rsvpData.summary || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [adminKey])

  useEffect(() => {
    if (authenticated && adminKey) fetchData()
  }, [authenticated, adminKey, fetchData])

  const handleAddInvitee = async (e: FormEvent) => {
    e.preventDefault()
    setAddError("")

    if (!newNameEn.trim()) {
      setAddError("English name is required")
      return
    }

    try {
      const res = await fetch("/api/invitees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminKey}`,
        },
        body: JSON.stringify({
          name_en: newNameEn.trim(),
          name_ar: newNameAr.trim(),
          slug: newSlug.trim() || slugify(newNameEn),
          email: newEmail.trim() || undefined,
          max_guests: parseInt(newMaxGuests) || 2,
          language_preference: newLangPref,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add invitee")
      }

      setNewNameEn("")
      setNewNameAr("")
      setNewSlug("")
      setNewEmail("")
      setNewMaxGuests("2")
      setNewLangPref("en")
      setShowAddForm(false)
      fetchData()
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add invitee")
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this invitee?")) return

    try {
      await fetch(`/api/invitees/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminKey}` },
      })
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  const copyInviteLink = (slug: string, lang?: "ar") => {
    const base = `${window.location.origin}/invite/${slug}`
    const url = lang ? `${base}?lang=${lang}` : base
    navigator.clipboard.writeText(url)
    setCopiedSlug(lang ? `${slug}-${lang}` : slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const exportCSV = () => {
    const rows = [
      ["Group Name (EN)", "Group Name (AR)", "Slug", "Max Guests", "Individual Name", "RSVP Status", "Email", "Message", "RSVP Date"],
      ...invitees.flatMap((inv) => {
        if (inv.rsvps.length === 0) {
          return [[
            inv.name_en,
            inv.name_ar,
            inv.slug,
            String(inv.max_guests),
            "",
            "pending",
            "",
            "",
            "",
          ]]
        }
        return inv.rsvps.map((r) => [
          inv.name_en,
          inv.name_ar,
          inv.slug,
          String(inv.max_guests),
          r.name,
          r.attending,
          r.email || "",
          r.message || "",
          r.submitted_at || "",
        ])
      }),
    ]

    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wedding-rsvps-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl" style={{ color: "#2a2a2a" }}>
              Admin Panel
            </h1>
            <p className="font-sans text-sm mt-2" style={{ color: "#888" }}>
              Wedding Guest Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full py-3 px-4 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#c8a96e40]"
              style={{ borderColor: authError ? "#dc2626" : "#c8a96e40" }}
              autoFocus
            />
            {authError && (
              <p className="text-xs text-center" style={{ color: "#dc2626" }}>
                {authError}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md"
              style={{ background: "linear-gradient(135deg, #c8a96e, #b89a5e)" }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10" style={{ borderColor: "#c8a96e20" }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl" style={{ color: "#2a2a2a" }}>
              Wedding Admin
            </h1>
            <p className="font-sans text-xs" style={{ color: "#888" }}>
              {weddingConfig.couple.coupleNames.en} &middot; {weddingConfig.date.display.en}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg text-xs font-medium border transition-all hover:shadow-sm"
              style={{ borderColor: "#c8a96e40", color: "#c8a96e" }}
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                setAuthenticated(false)
                setAdminKey("")
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Groups", value: invitees.length, color: "#2a2a2a" },
              { label: "Confirmed", value: summary.attending, color: "#5a6b50" },
              { label: "Declined", value: summary.declining, color: "#b08d98" },
              { label: "Pending", value: summary.pending, color: "#c8a96e" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 bg-white"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <p className="font-sans text-xs uppercase tracking-wider" style={{ color: "#999" }}>
                  {stat.label}
                </p>
                <p className="font-serif text-3xl mt-1" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Add Invitee */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md"
            style={{ background: "linear-gradient(135deg, #c8a96e, #b89a5e)" }}
          >
            {showAddForm ? "Cancel" : "+ Add Group / Invitee"}
          </button>

          {showAddForm && (
            <form
              onSubmit={handleAddInvitee}
              className="mt-4 p-6 rounded-xl bg-white grid gap-4 sm:grid-cols-2"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Group / Name (English) *</label>
                <input
                  type="text"
                  value={newNameEn}
                  onChange={(e) => {
                    setNewNameEn(e.target.value)
                    if (!newSlug) setNewSlug(slugify(e.target.value))
                  }}
                  placeholder='e.g. "Ahmed Family" or "John Smith"'
                  className="w-full py-2 px-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#c8a96e40]"
                  style={{ borderColor: "#c8a96e30" }}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Group / Name (Arabic)</label>
                <input
                  type="text"
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  dir="rtl"
                  placeholder='مثال: "عائلة أحمد"'
                  className="w-full py-2 px-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#c8a96e40]"
                  style={{ borderColor: "#c8a96e30" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">URL Slug</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder={slugify(newNameEn) || "auto-generated"}
                  className="w-full py-2 px-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#c8a96e40]"
                  style={{ borderColor: "#c8a96e30" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#c8a96e40]"
                  style={{ borderColor: "#c8a96e30" }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Max Guests (spots in group)</label>
                <select
                  value={newMaxGuests}
                  onChange={(e) => setNewMaxGuests(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#c8a96e40]"
                  style={{ borderColor: "#c8a96e30" }}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-600">Default Language</label>
                <select
                  value={newLangPref}
                  onChange={(e) => setNewLangPref(e.target.value as "en" | "ar")}
                  className="w-full py-2 px-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#c8a96e40]"
                  style={{ borderColor: "#c8a96e30" }}
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: "#c8a96e" }}
                >
                  Add Invitee
                </button>
                {addError && <p className="text-xs text-red-500">{addError}</p>}
              </div>
            </form>
          )}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "#c8a96e20" }}>
          {(["guests", "stats"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 text-sm font-medium capitalize transition-all"
              style={{
                color: activeTab === tab ? "#c8a96e" : "#999",
                borderBottom: activeTab === tab ? "2px solid #c8a96e" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {tab === "guests" ? "Guests" : "Stats"}
            </button>
          ))}
        </div>

        {/* ── GUESTS TAB ── */}
        {activeTab === "guests" && (
          <div className="rounded-xl bg-white overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "#c8a96e15" }}>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Group / Guest</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Slug</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">RSVPs</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Spots</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-400">Loading...</td>
                    </tr>
                  ) : invitees.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                        No invitees yet. Click &quot;+ Add Group / Invitee&quot; to get started.
                      </td>
                    </tr>
                  ) : (
                    invitees.map((inv) => {
                      const accepted = inv.rsvps.filter((r) => r.attending === "accept").length
                      const declined = inv.rsvps.filter((r) => r.attending === "decline").length
                      const hasResponses = inv.rsvps.length > 0
                      const isExpanded = expandedInvitee === inv.id

                      return (
                        <tr
                          key={inv.id}
                          className="border-b last:border-0 transition-colors"
                          style={{ borderColor: "#c8a96e08" }}
                        >
                          <td className="px-4 py-3" colSpan={5}>
                            <div
                              className="flex items-center justify-between cursor-pointer hover:bg-gray-50/50 -mx-4 px-4 py-1 rounded"
                              onClick={() => setExpandedInvitee(isExpanded ? null : inv.id)}
                            >
                              <div className="flex items-center gap-3">
                                {hasResponses && (
                                  <svg
                                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                                    className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                  >
                                    <path d="M4 2l4 4-4 4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                )}
                                {!hasResponses && <div className="w-3" />}
                                <div>
                                  <p className="font-medium text-gray-800">{inv.name_en}</p>
                                  {inv.name_ar && (
                                    <p className="text-xs text-gray-400 mt-0.5" dir="rtl">{inv.name_ar}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="hidden sm:inline">
                                  <code className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500">
                                    {inv.slug}
                                  </code>
                                </span>

                                <div className="flex items-center gap-1.5">
                                  {accepted > 0 && (
                                    <span
                                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                      style={{ background: "#5a6b5015", color: "#5a6b50" }}
                                    >
                                      {accepted} confirmed
                                    </span>
                                  )}
                                  {declined > 0 && (
                                    <span
                                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                      style={{ background: "#b08d9815", color: "#b08d98" }}
                                    >
                                      {declined} declined
                                    </span>
                                  )}
                                  {!hasResponses && (
                                    <span
                                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                      style={{ background: "#c8a96e15", color: "#c8a96e" }}
                                    >
                                      Pending
                                    </span>
                                  )}
                                </div>

                                <span className="hidden sm:inline text-xs text-gray-400">
                                  {accepted} / {inv.max_guests}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); copyInviteLink(inv.slug) }}
                                    className="px-2.5 py-1.5 rounded-lg text-xs border transition-all hover:shadow-sm"
                                    style={{ borderColor: "#c8a96e30", color: "#c8a96e" }}
                                  >
                                    {copiedSlug === inv.slug ? "Copied!" : "EN Link"}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); copyInviteLink(inv.slug, "ar") }}
                                    className="px-2.5 py-1.5 rounded-lg text-xs border transition-all hover:shadow-sm"
                                    style={{ borderColor: "#c8a96e30", color: "#c8a96e" }}
                                  >
                                    {copiedSlug === `${inv.slug}-ar` ? "Copied!" : "AR Link"}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(inv.slug) }}
                                    className="px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Expanded individual RSVPs */}
                            {isExpanded && hasResponses && (
                              <div className="mt-3 ml-6 border-l-2 pl-4" style={{ borderColor: "#c8a96e20" }}>
                                {inv.rsvps.map((rsvp) => (
                                  <div
                                    key={rsvp.id}
                                    className="py-2 flex items-start justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                                        style={{
                                          background: rsvp.attending === "accept" ? "rgba(90,107,80,0.12)" : "rgba(176,141,152,0.12)",
                                        }}
                                      >
                                        {rsvp.attending === "accept" ? (
                                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                            <path d="M5 13l4 4L19 7" stroke="#5a6b50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        ) : (
                                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 6l12 12M18 6L6 18" stroke="#b08d98" strokeWidth="3" strokeLinecap="round" />
                                          </svg>
                                        )}
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-gray-700">{rsvp.name}</span>
                                        {rsvp.email && (
                                          <span className="text-xs text-gray-400 ml-2">{rsvp.email}</span>
                                        )}
                                        {rsvp.message && (
                                          <p className="text-xs text-gray-400 mt-0.5 italic">&ldquo;{rsvp.message}&rdquo;</p>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">
                                      {new Date(rsvp.submitted_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STATS TAB ── */}
        {activeTab === "stats" && (() => {
          const totalSlots = invitees.reduce((sum, i) => sum + i.max_guests, 0)
          const confirmed = summary?.attending ?? 0
          const declined = summary?.declining ?? 0
          const pending = summary?.pending ?? 0
          const attendanceRate = totalSlots > 0 ? Math.round((confirmed / totalSlots) * 100) : 0

          const confirmedGuests = invitees.flatMap((inv) =>
            inv.rsvps
              .filter((r) => r.attending === "accept")
              .map((r) => ({ name: r.name, group: inv.name_en, date: r.submitted_at }))
          )
          const declinedGuests = invitees.flatMap((inv) =>
            inv.rsvps
              .filter((r) => r.attending === "decline")
              .map((r) => ({ name: r.name, group: inv.name_en, date: r.submitted_at }))
          )

          return (
            <div className="space-y-6">
              {/* Big stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Total Groups", value: invitees.length, color: "#2a2a2a" },
                  { label: "Confirmed", value: confirmed, color: "#5a6b50" },
                  { label: "Declined", value: declined, color: "#b08d98" },
                  { label: "Pending", value: pending, color: "#c8a96e" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-5 bg-white"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    <p className="font-sans text-xs uppercase tracking-wider" style={{ color: "#999" }}>
                      {stat.label}
                    </p>
                    <p className="font-serif text-4xl mt-1" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Attendance rate */}
              <div className="rounded-xl p-6 bg-white" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Attendance Rate</p>
                  <p className="text-sm font-semibold" style={{ color: "#5a6b50" }}>
                    {confirmed} / {totalSlots} slots filled ({attendanceRate}%)
                  </p>
                </div>
                <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: "#f0ece6" }}>
                  <div
                    className="h-3 rounded-full transition-all duration-700"
                    style={{ width: `${attendanceRate}%`, background: "linear-gradient(90deg, #5a6b50, #8aaa7e)" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>{confirmed} confirmed</span>
                  <span>{declined} declined</span>
                  <span>{pending} pending</span>
                </div>
              </div>

              {/* Per-group breakdown */}
              <div className="rounded-xl bg-white overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "#c8a96e15" }}>
                  <h3 className="text-sm font-semibold text-gray-700">Per-Group Breakdown</h3>
                </div>
                {loading ? (
                  <p className="px-5 py-8 text-center text-gray-400 text-sm">Loading...</p>
                ) : invitees.length === 0 ? (
                  <p className="px-5 py-8 text-center text-gray-400 text-sm">No groups yet.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "#c8a96e08" }}>
                    {invitees.map((inv) => {
                      const acc = inv.rsvps.filter((r) => r.attending === "accept").length
                      const dec = inv.rsvps.filter((r) => r.attending === "decline").length
                      const fillPct = inv.max_guests > 0 ? Math.round((acc / inv.max_guests) * 100) : 0
                      return (
                        <div key={inv.id} className="px-5 py-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-sm font-medium text-gray-800">{inv.name_en}</span>
                              {inv.name_ar && (
                                <span className="text-xs text-gray-400 ml-2" dir="rtl">{inv.name_ar}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span style={{ color: "#5a6b50" }}>{acc} confirmed</span>
                              <span style={{ color: "#b08d98" }}>{dec} declined</span>
                              <span className="text-gray-400">{inv.max_guests - acc - dec} pending</span>
                              <span className="text-gray-400">/ {inv.max_guests} slots</span>
                            </div>
                          </div>
                          <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: "#f0ece6" }}>
                            <div
                              className="h-2 rounded-full"
                              style={{ width: `${fillPct}%`, background: "#5a6b50" }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Confirmed guest list */}
              <div className="rounded-xl bg-white overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#c8a96e15" }}>
                  <h3 className="text-sm font-semibold text-gray-700">Confirmed Guests</h3>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ background: "#5a6b5015", color: "#5a6b50" }}
                  >
                    {confirmedGuests.length}
                  </span>
                </div>
                {confirmedGuests.length === 0 ? (
                  <p className="px-5 py-8 text-center text-gray-400 text-sm">No confirmed guests yet.</p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "#c8a96e08" }}>
                    {confirmedGuests.map((g, i) => (
                      <div key={i} className="px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "rgba(90,107,80,0.12)" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M5 13l4 4L19 7" stroke="#5a6b50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-800">{g.name}</span>
                            <span className="text-xs text-gray-400 ml-2">({g.group})</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(g.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Declined guest list */}
              {declinedGuests.length > 0 && (
                <div className="rounded-xl bg-white overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "#c8a96e15" }}>
                    <h3 className="text-sm font-semibold text-gray-700">Declined</h3>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: "#b08d9815", color: "#b08d98" }}
                    >
                      {declinedGuests.length}
                    </span>
                  </div>
                  <div className="divide-y" style={{ borderColor: "#c8a96e08" }}>
                    {declinedGuests.map((g, i) => (
                      <div key={i} className="px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "rgba(176,141,152,0.12)" }}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M6 6l12 12M18 6L6 18" stroke="#b08d98" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">{g.name}</span>
                            <span className="text-xs text-gray-400 ml-2">({g.group})</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(g.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </main>
    </div>
  )
}
