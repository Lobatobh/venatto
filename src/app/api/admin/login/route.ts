import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createSessionToken, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from '@/lib/admin-session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const passwordHash = process.env.ADMIN_PASSWORD_HASH

    if (!adminEmail || !passwordHash) {
      return NextResponse.json({ error: 'Admin environment variables not configured' }, { status: 500 })
    }

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = createSessionToken(email)
    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE,
    })
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
