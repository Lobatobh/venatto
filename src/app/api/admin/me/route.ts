import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, getSessionTokenFromRequest, validateSessionToken } from '@/lib/admin-session'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || getSessionTokenFromRequest(request)
  const email = token ? validateSessionToken(token) : null

  if (!email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true, email })
}
