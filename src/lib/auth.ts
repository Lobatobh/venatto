import { NextRequest, NextResponse } from 'next/server'

export function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get('admin-session')?.value
  return session === 'authenticated'
}

export function requireAuth(request: NextRequest): NextResponse | null {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}