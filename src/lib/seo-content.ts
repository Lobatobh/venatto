import fs from 'fs/promises'
import path from 'path'

export interface SeoData {
  title: string
  description: string
  keywords: string
  ogImage: string
  canonical: string
}

export const defaultSeoData: SeoData = {
  title: 'VENATTO | Mobiliário Planejado de Alto Padrão',
  description: 'Elegância feita sob medida para ambientes exclusivos.',
  keywords: 'móveis planejados, marcenaria, interiores, Venatto',
  ogImage: '',
  canonical: 'https://venatto.com.br'
}

const draftFilePath = path.join(process.cwd(), 'data', 'seo.draft.json')
const publishedFilePath = path.join(process.cwd(), 'data', 'seo.published.json')

async function ensureSeoFile(filePath: string) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultSeoData, null, 2), 'utf-8')
  }
}

export async function readSeoDraftFile(): Promise<SeoData> {
  try {
    await ensureSeoFile(draftFilePath)
    const data = await fs.readFile(draftFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    return { ...defaultSeoData, ...parsed }
  } catch (error) {
    console.warn('Failed to load SEO draft content, using defaults:', error)
    return defaultSeoData
  }
}

export async function readSeoPublishedFile(): Promise<SeoData | null> {
  try {
    await fs.access(publishedFilePath)
    const data = await fs.readFile(publishedFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    return { ...defaultSeoData, ...parsed }
  } catch (error) {
    // Published file doesn't exist yet
    return null
  }
}

export async function writeSeoDraftFile(content: SeoData) {
  await fs.mkdir(path.dirname(draftFilePath), { recursive: true })
  await fs.writeFile(draftFilePath, JSON.stringify(content, null, 2), 'utf-8')
}

export async function writeSeoPublishedFile(content: SeoData) {
  await fs.mkdir(path.dirname(publishedFilePath), { recursive: true })
  await fs.writeFile(publishedFilePath, JSON.stringify(content, null, 2), 'utf-8')
}

export async function publishSeoContent() {
  const draftContent = await readSeoDraftFile()
  await writeSeoPublishedFile(draftContent)
}

export async function revertSeoContent() {
  const publishedContent = await readSeoPublishedFile()
  if (publishedContent) {
    await writeSeoDraftFile(publishedContent)
  } else {
    // If no published version exists, reset to defaults
    await writeSeoDraftFile(defaultSeoData)
  }
}

export async function hasUnpublishedSeoChanges(): Promise<boolean> {
  const draftContent = await readSeoDraftFile()
  const publishedContent = await readSeoPublishedFile()

  if (!publishedContent) {
    // If no published version exists, there are changes to publish
    return true
  }

  return JSON.stringify(draftContent) !== JSON.stringify(publishedContent)
}

export async function getSeoContent(): Promise<SeoData> {
  // Try to read published content first, fallback to draft
  let seoData = await readSeoPublishedFile()
  if (!seoData) {
    seoData = await readSeoDraftFile()
  }

  return seoData
}