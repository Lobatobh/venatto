import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const MEDIA_DIR = path.join(process.cwd(), 'data', 'media')

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename

    // Protect against path traversal
    const safeFilename = path.basename(filename)
    if (safeFilename !== filename) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const filePath = path.join(MEDIA_DIR, safeFilename)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath)

    // Determine content type
    const ext = path.extname(safeFilename).toLowerCase()
    let contentType = 'application/octet-stream'
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.webp') contentType = 'image/webp'
    else if (ext === '.svg') contentType = 'image/svg+xml'
    else if (ext === '.mp4') contentType = 'video/mp4'
    else if (ext === '.webm') contentType = 'video/webm'
    else if (ext === '.mov') contentType = 'video/quicktime'
    else if (ext === '.pdf') contentType = 'application/pdf'

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year cache
      },
    })
  } catch (error) {
    console.error('Error serving media:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}