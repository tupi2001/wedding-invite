import type { Metadata } from "next"
import { PersonalizedInviteClient } from "./client"
import type { Language } from "@/lib/types"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  let title = "Nada & Karim - Wedding Invitation"
  let description = "You are invited to celebrate the wedding of Nada & Karim - May 22, 2026"

  try {
    const { getInviteeBySlug } = await import("@/lib/db")
    const invitee = await getInviteeBySlug(slug)
    if (invitee) {
      title = `${invitee.name_en} - Nada & Karim Wedding`
      description = `Dear ${invitee.name_en}, you are cordially invited to the wedding of Nada & Karim - May 22, 2026`
    }
  } catch {
    // Use defaults
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  }
}

export default async function InvitePage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { lang: langParam } = await searchParams
  let invitee = null

  try {
    const { getInviteeBySlug } = await import("@/lib/db")
    invitee = await getInviteeBySlug(slug)
  } catch {
    // Invitee not found or Supabase not configured, show generic invite
  }

  const langOverride: Language | undefined =
    langParam === "ar" ? "ar" : langParam === "en" ? "en" : undefined

  return (
    <PersonalizedInviteClient
      invitee={invitee ? {
        id: invitee.id,
        name_en: invitee.name_en,
        name_ar: invitee.name_ar,
        slug: invitee.slug,
        max_guests: invitee.max_guests,
        language_preference: invitee.language_preference,
      } : null}
      langOverride={langOverride}
    />
  )
}
