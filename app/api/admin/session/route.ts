import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_session"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const storedPassword = decoded.split(":")[0]
    const expected = process.env.ADMIN_PASSWORD || "wedding2026"

    if (storedPassword !== expected) {
      cookieStore.delete(COOKIE_NAME)
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true, adminKey: expected })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
