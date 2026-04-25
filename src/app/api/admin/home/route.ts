import { NextRequest, NextResponse } from 'next/server'
import { validateSessionToken, getSessionTokenFromRequest } from '@/lib/admin-session'
import { readHomeFile, normalizeHomeData, writeHomeFile, AdminHomeData, defaultHomeData } from '@/lib/home-content'

export async function GET() {
  try {
    const content = await readHomeFile()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error reading home content:', error)
    return NextResponse.json(defaultHomeData)
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = validateSessionToken(token)
    if (!email) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json()
    const content = normalizeHomeData(body)

    await writeHomeFile(content)

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Home content update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}