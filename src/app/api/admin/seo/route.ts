import { NextRequest, NextResponse } from 'next/server'
import { validateSessionToken, getSessionTokenFromRequest } from '@/lib/admin-session'
import { readSeoDraftFile, writeSeoDraftFile, publishSeoContent, revertSeoContent, hasUnpublishedSeoChanges, SeoData, defaultSeoData } from '@/lib/seo-content'

export async function GET() {
  try {
    const content = await readSeoDraftFile()
    const hasChanges = await hasUnpublishedSeoChanges()
    return NextResponse.json({ content, hasUnpublishedChanges: hasChanges })
  } catch (error) {
    console.error('Error reading SEO content:', error)
    return NextResponse.json({ content: defaultSeoData, hasUnpublishedChanges: false })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = validateSessionToken(token)
    if (!email) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json()
    const content: SeoData = {
      title: body.title || defaultSeoData.title,
      description: body.description || defaultSeoData.description,
      keywords: body.keywords || defaultSeoData.keywords,
      ogImage: body.ogImage || defaultSeoData.ogImage,
      canonical: body.canonical || defaultSeoData.canonical
    }

    await writeSeoDraftFile(content)

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('SEO content update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getSessionTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = validateSessionToken(token)
    if (!email) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action === 'publish') {
      await publishSeoContent()
      return NextResponse.json({ success: true, message: 'SEO publicado com sucesso' })
    } else if (action === 'revert') {
      await revertSeoContent()
      return NextResponse.json({ success: true, message: 'SEO revertido com sucesso' })
    } else {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
  } catch (error) {
    console.error('SEO content action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}