import { NextRequest, NextResponse } from "next/server"
import { getAllInvitees, createInvitee } from "@/lib/db"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  const expectedKey = process.env.ADMIN_PASSWORD || "wedding2026"
  return authHeader === `Bearer ${expectedKey}`
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const invitees = await getAllInvitees()
    return NextResponse.json({ invitees })
  } catch (error) {
    console.error("Invitees fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch invitees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name_en, name_ar, slug, email, phone, max_guests, language_preference } = body

    if (!name_en) {
      return NextResponse.json({ error: "English name is required" }, { status: 400 })
    }

    const finalSlug = slug || slugify(name_en)

    const invitee = await createInvitee({
      name_en,
      name_ar: name_ar || "",
      slug: finalSlug,
      email,
      phone,
      max_guests: max_guests ?? 2,
      language_preference: language_preference ?? "en",
    })

    return NextResponse.json({ success: true, invitee })
  } catch (error) {
    console.error("Invitee creation error:", error)
    const message = error instanceof Error ? error.message : "Failed to create invitee"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
