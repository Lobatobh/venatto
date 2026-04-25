import { NextRequest, NextResponse } from 'next/server'
import { validateSessionToken, getSessionTokenFromRequest } from '@/lib/admin-session'
import fs from 'fs/promises'
import path from 'path'

const filePath = path.join(process.cwd(), 'data', 'home.json')

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    const content = JSON.parse(data)
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error reading home content:', error)
    // Return default content if file doesn't exist
    const defaultContent = {
      title: 'Bem-vindo ao Venatto',
      subtitle: 'Soluções inovadoras para seu negócio',
      buttonText: 'Saiba Mais'
    }
    return NextResponse.json(defaultContent)
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

    const { title, subtitle, buttonText } = await request.json()

    const content = {
      title: title || 'Elegância feita sob medida',
      subtitle: subtitle || 'Mobiliário planejado de alto padrão',
      buttonText: buttonText || 'Solicitar projeto'
    }

    await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Home content update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}