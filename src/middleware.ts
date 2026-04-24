import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

function verifyAdminSessionToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) return false

    jwt.verify(token, secret)
    return true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login routes
  if (pathname === '/admin/login' || pathname === '/api/admin/auth/login') {
    return NextResponse.next()
  }

  // Protect admin routes
  if (pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')) {
    const token = request.cookies.get('venatto_admin_session')?.value

    if (!token || !verifyAdminSessionToken(token)) {
      if (pathname.startsWith('/api/admin/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      } else {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}