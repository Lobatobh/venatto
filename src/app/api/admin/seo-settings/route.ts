import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'

const seoSettingsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.string().min(1),
  ogImageUrl: z.string().optional(),
  canonicalUrl: z.string().optional(),
})

export async function GET() {
  try {
    const settings = await db.seoSettings.findFirst()
    if (!settings) {
      return NextResponse.json({ error: 'SEO settings not found' }, { status: 404 })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Get SEO settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const validatedData = seoSettingsSchema.parse(body)

    const settings = await db.seoSettings.upsert({
      where: { id: 'default' },
      update: { ...validatedData, updatedAt: new Date() },
      create: { id: 'default', ...validatedData },
    })

    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update SEO settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}