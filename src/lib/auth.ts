import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

function getCookieFromHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null

  const cookies = cookieHeader.split(';').map(cookie => cookie.trim())

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split('=')
    if (key === name) {
      return decodeURIComponent(valueParts.join('='))
    }
  }

  return null
}

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
  const tokenFromNext = request.cookies.get('venatto_admin_session')?.value
  const tokenFromHeader = getCookieFromHeader(
    request.headers.get('cookie'),
    'venatto_admin_session'
  )

  const token = tokenFromNext || tokenFromHeader

  if (process.env.DEBUG_AUTH === 'true') {
    console.log('[AUTH DEBUG]', {
      hasNextCookie: Boolean(tokenFromNext),
      hasHeaderCookie: Boolean(tokenFromHeader),
      hasSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
      valid: token ? verifyAdminSessionToken(token) : false,
    })
  }

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
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })
  return response
}