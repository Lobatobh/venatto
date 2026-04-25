import { createHmac, timingSafeEqual } from 'crypto'

export const ADMIN_SESSION_COOKIE = 'venatto_admin_session'
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8 // 8 hours

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET not configured')
  }
  return secret
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlDecode(value: string) {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=')
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

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

export function createSessionToken(email: string) {
  const payload = {
    email,
    exp: Date.now() + ADMIN_SESSION_MAX_AGE * 1000,
  }

  const encoded = base64UrlEncode(JSON.stringify(payload))
  const signature = createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  return `${encoded}.${signature}`
}

export function validateSessionToken(token: string) {
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expectedSignature = createHmac('sha256', getSessionSecret())
    .update(encoded)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  try {
    const signatureBuffer = Buffer.from(signature, 'utf8')
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8')
    if (signatureBuffer.length !== expectedBuffer.length) return null
    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null

    const payloadJson = base64UrlDecode(encoded)
    const payload = JSON.parse(payloadJson) as { email?: string; exp?: number }

    if (typeof payload.email !== 'string' || typeof payload.exp !== 'number') {
      return null
    }
    if (payload.exp < Date.now()) {
      return null
    }

    return payload.email
  } catch {
    return null
  }
}

export function getSessionTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie')
  return getCookieFromHeader(cookieHeader, ADMIN_SESSION_COOKIE)
}
