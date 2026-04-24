import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { isAuthenticated } from '@/lib/auth'

const siteSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
})

export async function GET() {
  try {
    const settings = await db.siteSettings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Get site settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = siteSettingsSchema.parse(body)

    const settings = await db.siteSettings.upsert({
      where: { id: 'default' },
      update: { ...validatedData, updatedAt: new Date() },
      create: { id: 'default', ...validatedData },
    })

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update site settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}