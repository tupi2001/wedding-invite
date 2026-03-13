import { readdirSync } from "fs"
import path from "path"

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"])

export function getGalleryPhotos() {
  try {
    const imgDir = path.join(process.cwd(), "public", "img")
    const entries = readdirSync(imgDir, { withFileTypes: true })

    return entries
      .filter((entry) => {
        if (!entry.isFile()) return false
        return IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
      .map((entry) => ({
        src: `/img/${entry.name}`,
        alt: path.basename(entry.name, path.extname(entry.name)),
      }))
  } catch {
    return []
  }
}
