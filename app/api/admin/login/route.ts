import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const expected = process.env.ADMIN_PASSWORD || "wedding2026"

    if (password !== expected) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = Buffer.from(`${expected}:${Date.now()}`).toString("base64")

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    })

    return NextResponse.json({ success: true, adminKey: expected })
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
