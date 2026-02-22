import { NextRequest, NextResponse } from "next/server"
import { submitRSVP, getAllRSVPs, getRSVPSummary, getRSVPsByInviteeId } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invitee_id, name, email, attending, message } = body

    if (!attending || !["accept", "decline"].includes(attending)) {
      return NextResponse.json(
        { error: "Valid attendance status is required (accept or decline)" },
        { status: 400 }
      )
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const rsvp = await submitRSVP({
      invitee_id: invitee_id || null,
      name: name.trim(),
      email: email || "",
      attending,
      message: message || "",
    })

    return NextResponse.json({
      success: true,
      message:
        attending === "accept"
          ? "Thank you for your RSVP! We can't wait to celebrate with you!"
          : "Thank you for letting us know. We'll miss you!",
      id: rsvp.id,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit RSVP"
    const status = errorMessage.includes("spots") || errorMessage.includes("already") ? 409 : 500
    console.error("RSVP submission error:", error)
    return NextResponse.json({ error: errorMessage }, { status })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const inviteeId = searchParams.get("invitee_id")
    if (inviteeId) {
      const responses = await getRSVPsByInviteeId(inviteeId)
      return NextResponse.json({ responses })
    }

    const adminKey = searchParams.get("key")
    const expectedKey = process.env.ADMIN_PASSWORD || "wedding2026"

    if (adminKey !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [responses, summary] = await Promise.all([getAllRSVPs(), getRSVPSummary()])
    return NextResponse.json({ summary, responses })
  } catch (error) {
    console.error("RSVP fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 })
  }
}
