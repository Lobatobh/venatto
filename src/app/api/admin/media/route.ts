import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { getSessionTokenFromRequest, validateSessionToken } from '@/lib/admin-session'

const MEDIA_DIR = path.join(process.cwd(), 'data', 'media')
const LIBRARY_FILE = path.join(MEDIA_DIR, 'library.json')

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'file'
  name: string
  filename: string
  url: string
  mimeType: string
  size: number
  createdAt: string
}

interface MediaLibrary {
  items: MediaItem[]
}

const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  file: ['application/pdf']
}

const SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  video: 50 * 1024 * 1024, // 50MB
  file: 10 * 1024 * 1024 // 10MB
}

function getTypeFromMime(mimeType: string): 'image' | 'video' | 'file' | null {
  if (ALLOWED_TYPES.image.includes(mimeType)) return 'image'
  if (ALLOWED_TYPES.video.includes(mimeType)) return 'video'
  if (ALLOWED_TYPES.file.includes(mimeType)) return 'file'
  return null
}

async function ensureLibraryExists() {
  try {
    await fs.access(LIBRARY_FILE)
  } catch {
    await fs.writeFile(LIBRARY_FILE, JSON.stringify({ items: [] }, null, 2))
  }
}

async function readLibrary(): Promise<MediaLibrary> {
  await ensureLibraryExists()
  const data = await fs.readFile(LIBRARY_FILE, 'utf-8')
  return JSON.parse(data)
}

async function writeLibrary(library: MediaLibrary) {
  await fs.writeFile(LIBRARY_FILE, JSON.stringify(library, null, 2))
}

function validateSession(request: NextRequest): boolean {
  const token = getSessionTokenFromRequest(request)
  if (!token) return false
  const email = validateSessionToken(token)
  return email !== null
}

export async function GET(request: NextRequest) {
  if (!validateSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const library = await readLibrary()
    return NextResponse.json(library)
  } catch (error) {
    console.error('Error reading media library:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const type = getTypeFromMime(file.type)
    if (!type) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    }

    if (file.size > SIZE_LIMITS[type]) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    const id = randomUUID()
    const filename = `${id}${ext}`
    const filePath = path.join(MEDIA_DIR, filename)

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    // Update library
    const library = await readLibrary()
    const item: MediaItem = {
      id,
      type,
      name: file.name,
      filename,
      url: `/api/media/${filename}`,
      mimeType: file.type,
      size: file.size,
      createdAt: new Date().toISOString()
    }
    library.items.push(item)
    await writeLibrary(library)

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error uploading media:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!validateSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'No id provided' }, { status: 400 })
    }

    const library = await readLibrary()
    const itemIndex = library.items.findIndex(item => item.id === id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const item = library.items[itemIndex]

    // Delete file
    const filePath = path.join(MEDIA_DIR, item.filename)
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
      // Continue anyway
    }

    // Update library
    library.items.splice(itemIndex, 1)
    await writeLibrary(library)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}