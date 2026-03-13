import { supabase } from "./supabase"
import type { Invitee, RSVPResponse, RSVPSummary, InviteeWithRSVPs } from "./types"

export async function getInviteeBySlug(slug: string): Promise<Invitee | null> {
  const { data, error } = await supabase
    .from("invitees")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) return null
  return data as unknown as Invitee
}

export async function getAllInvitees(): Promise<Invitee[]> {
  const { data, error } = await supabase
    .from("invitees")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as Invitee[]
}

export async function createInvitee(invitee: {
  name_en: string
  name_ar: string
  slug: string
  email?: string
  phone?: string
  max_guests?: number
  language_preference?: string
}): Promise<Invitee> {
  const { data, error } = await supabase
    .from("invitees")
    .insert({
      name_en: invitee.name_en,
      name_ar: invitee.name_ar,
      slug: invitee.slug,
      email: invitee.email || null,
      phone: invitee.phone || null,
      max_guests: invitee.max_guests ?? 2,
      language_preference: invitee.language_preference ?? "en",
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as Invitee
}

export async function updateInvitee(
  id: string,
  updates: Record<string, unknown>
): Promise<Invitee> {
  const { data, error } = await supabase
    .from("invitees")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(updates as any)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as Invitee
}

export async function deleteInvitee(id: string): Promise<void> {
  const { error } = await supabase.from("invitees").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function getRSVPsByInviteeId(inviteeId: string): Promise<RSVPResponse[]> {
  const { data, error } = await supabase
    .from("rsvp_responses")
    .select("*")
    .eq("invitee_id", inviteeId)
    .order("submitted_at", { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as RSVPResponse[]
}

export async function getAcceptedCountForInvitee(inviteeId: string): Promise<number> {
  const { count, error } = await supabase
    .from("rsvp_responses")
    .select("*", { count: "exact", head: true })
    .eq("invitee_id", inviteeId)
    .eq("attending", "accept")

  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function submitRSVP(rsvp: {
  invitee_id?: string | null
  name: string
  email?: string
  attending: string
  message?: string
}): Promise<RSVPResponse> {
  if (rsvp.invitee_id && rsvp.attending === "accept") {
    const { data: inviteeData } = await supabase
      .from("invitees")
      .select("max_guests")
      .eq("id", rsvp.invitee_id)
      .single()

    if (inviteeData) {
      const currentCount = await getAcceptedCountForInvitee(rsvp.invitee_id)
      if (currentCount >= (inviteeData as unknown as { max_guests: number }).max_guests) {
        throw new Error("All spots for this invitation have been filled")
      }
    }
  }

  if (rsvp.invitee_id) {
    const existing = await getRSVPsByInviteeId(rsvp.invitee_id)
    const normalizedName = rsvp.name.trim().toLowerCase()
    const duplicate = existing.find(
      (r) => r.name.trim().toLowerCase() === normalizedName
    )
    if (duplicate) {
      throw new Error("You have already submitted your RSVP")
    }
  }

  const { data, error } = await supabase
    .from("rsvp_responses")
    .insert({
      invitee_id: rsvp.invitee_id || null,
      name: rsvp.name,
      email: rsvp.email?.toLowerCase() || "",
      attending: rsvp.attending,
      message: rsvp.message || "",
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as RSVPResponse
}

export async function getAllRSVPs(): Promise<RSVPResponse[]> {
  const { data, error } = await supabase
    .from("rsvp_responses")
    .select("*")
    .order("submitted_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as RSVPResponse[]
}

export async function getRSVPSummary(): Promise<RSVPSummary> {
  const [invitees, rsvps] = await Promise.all([getAllInvitees(), getAllRSVPs()])

  const attending = rsvps.filter((r) => r.attending === "accept").length
  const declining = rsvps.filter((r) => r.attending === "decline").length

  const inviteeIdsWithRsvp = new Set(rsvps.map((r) => r.invitee_id).filter(Boolean))
  const pending = invitees.filter((inv) => !inviteeIdsWithRsvp.has(inv.id)).length

  return {
    total: rsvps.length,
    attending,
    declining,
    totalGuests: attending,
    pending,
  }
}

export async function deleteRSVP(id: string): Promise<void> {
  const { error } = await supabase.from("rsvp_responses").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

export async function getInviteesWithRSVPs(): Promise<InviteeWithRSVPs[]> {
  const [invitees, rsvps] = await Promise.all([getAllInvitees(), getAllRSVPs()])

  return invitees.map((invitee) => ({
    ...invitee,
    rsvps: rsvps.filter((r) => r.invitee_id === invitee.id),
  }))
}
