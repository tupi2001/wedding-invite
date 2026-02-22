export type Language = "en" | "ar"

export interface Invitee {
  id: string
  name_en: string
  name_ar: string
  slug: string
  email: string | null
  phone: string | null
  max_guests: number
  language_preference: Language
  created_at: string
}

export interface RSVPResponse {
  id: string
  invitee_id: string | null
  name: string
  email: string
  attending: "accept" | "decline"
  message: string
  submitted_at: string
}

export interface RSVPSummary {
  total: number
  attending: number
  declining: number
  totalGuests: number
  pending: number
}

export interface InviteeWithRSVPs extends Invitee {
  rsvps: RSVPResponse[]
}
