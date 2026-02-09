import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// RSVP data structure
interface RSVPEntry {
  id: string
  timestamp: string
  name: string
  email: string
  attending: "Joyfully Accept" | "Regretfully Decline"
  guests: number
  dietary: string
  message: string
}

// Path to store RSVP data (in production, use a proper database)
const DATA_DIR = path.join(process.cwd(), "data")
const RSVP_FILE = path.join(DATA_DIR, "rsvp-responses.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read existing RSVP data
async function readRSVPData(): Promise<RSVPEntry[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(RSVP_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Write RSVP data
async function writeRSVPData(data: RSVPEntry[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(RSVP_FILE, JSON.stringify(data, null, 2), "utf-8")
}

// Generate unique ID
function generateId(): string {
  return `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// POST - Submit new RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { name, email, attending, guests, dietary, message } = body

    // Validate required fields
    if (!attending) {
      return NextResponse.json(
        { error: "Attendance status is required" },
        { status: 400 }
      )
    }

    // For accepting guests, validate additional fields
    if (attending === "Joyfully Accept") {
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required when accepting" },
          { status: 400 }
        )
      }
    }

    // Create RSVP entry
    const entry: RSVPEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      name: name || "Anonymous",
      email: email || "",
      attending,
      guests: attending === "Joyfully Accept" ? parseInt(guests) || 1 : 0,
      dietary: dietary || "",
      message: message || "",
    }

    // Read existing data and append new entry
    const existingData = await readRSVPData()
    
    // Check for duplicate email (optional - update existing entry)
    const existingIndex = existingData.findIndex(
      (e) => e.email && e.email.toLowerCase() === email?.toLowerCase()
    )
    
    if (existingIndex >= 0) {
      // Update existing entry
      existingData[existingIndex] = { ...entry, id: existingData[existingIndex].id }
    } else {
      // Add new entry
      existingData.push(entry)
    }

    await writeRSVPData(existingData)

    return NextResponse.json({
      success: true,
      message: attending === "Joyfully Accept" 
        ? "Thank you for your RSVP! We can't wait to celebrate with you!"
        : "Thank you for letting us know. We'll miss you!",
      id: entry.id,
    })
  } catch (error) {
    console.error("RSVP submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit RSVP. Please try again." },
      { status: 500 }
    )
  }
}

// GET - Retrieve all RSVPs (protected - for admin use)
export async function GET(request: NextRequest) {
  try {
    // Simple auth check via query param (in production, use proper auth)
    const { searchParams } = new URL(request.url)
    const adminKey = searchParams.get("key")
    
    // Set your admin key in environment variable
    const expectedKey = process.env.RSVP_ADMIN_KEY || "wedding2026"
    
    if (adminKey !== expectedKey) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await readRSVPData()
    
    // Calculate summary statistics
    const summary = {
      total: data.length,
      attending: data.filter((e) => e.attending === "Joyfully Accept").length,
      declining: data.filter((e) => e.attending === "Regretfully Decline").length,
      totalGuests: data
        .filter((e) => e.attending === "Joyfully Accept")
        .reduce((sum, e) => sum + e.guests, 0),
    }

    return NextResponse.json({ summary, responses: data })
  } catch (error) {
    console.error("RSVP fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    )
  }
}

