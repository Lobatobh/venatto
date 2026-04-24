import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function verifyAdminSessionToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) return false

    jwt.verify(token, secret)
    return true
  } catch {
    return false
  }
}

export function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('venatto_admin_session')?.value
  return token ? verifyAdminSessionToken(token) : false
}

export function requireAuth(request: NextRequest): NextResponse | null {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

export async function createAdminSession(email: string): Promise<NextResponse> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET not configured')
  }

  const token = jwt.sign({ email }, secret, { expiresIn: '24h' })

  const response = NextResponse.json({ success: true })
  response.cookies.set('venatto_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })
  return response
}