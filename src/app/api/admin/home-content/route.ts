import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'

const homeContentSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroButtonText: z.string().min(1),
  heroButtonLink: z.string().min(1),
  heroImageUrl: z.string().min(1),
  aboutText: z.string().min(1),
  differentialsText: z.string().min(1),
  projectsText: z.string().min(1),
  processText: z.string().min(1),
  contactText: z.string().min(1),
})

export async function GET() {
  try {
    const content = await db.homeContent.findFirst()
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }
    return NextResponse.json(content)
  } catch (error) {
    console.error('Get home content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const validatedData = homeContentSchema.parse(body)

    const content = await db.homeContent.upsert({
      where: { id: 'default' },
      update: { ...validatedData, updatedAt: new Date() },
      create: { id: 'default', ...validatedData },
    })

    return NextResponse.json(content)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Update home content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}