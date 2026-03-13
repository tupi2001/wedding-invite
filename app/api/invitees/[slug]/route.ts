import { NextRequest, NextResponse } from "next/server"
import { getInviteeBySlug, updateInvitee, deleteInvitee } from "@/lib/db"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const invitee = await getInviteeBySlug(slug)

    if (!invitee) {
      return NextResponse.json({ error: "Invitee not found" }, { status: 404 })
    }

    return NextResponse.json({ invitee })
  } catch (error) {
    console.error("Invitee fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch invitee" }, { status: 500 })
  }
}

function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  const expectedKey = process.env.ADMIN_PASSWORD || "wedding2026"
  return authHeader === `Bearer ${expectedKey}`
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await params
    const invitee = await getInviteeBySlug(slug)
    if (!invitee) {
      return NextResponse.json({ error: "Invitee not found" }, { status: 404 })
    }

    const body = await request.json()
    const updated = await updateInvitee(invitee.id, body)
    return NextResponse.json({ success: true, invitee: updated })
  } catch (error) {
    console.error("Invitee update error:", error)
    return NextResponse.json({ error: "Failed to update invitee" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await params
    const invitee = await getInviteeBySlug(slug)
    if (!invitee) {
      return NextResponse.json({ error: "Invitee not found" }, { status: 404 })
    }

    await deleteInvitee(invitee.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Invitee delete error:", error)
    return NextResponse.json({ error: "Failed to delete invitee" }, { status: 500 })
  }
}
