import fs from 'fs/promises'
import path from 'path'

export interface AdminHomeData {
  hero: {
    title: string
    highlight: string
    subtitle: string
    buttonText: string
    buttonLink: string
    backgroundImage: string
  }
  about: {
    eyebrow: string
    title: string
    text: string
  }
  cta: {
    title: string
    subtitle: string
    buttonText: string
    buttonLink: string
  }
  contact: {
    whatsapp: string
    email: string
    instagram: string
    city: string
  }
  branding: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
}

export interface HomeContent {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroButtonLink: string
  heroImageUrl: string
  aboutText: string
  differentialsText: string
  projectsText: string
  processText: string
  contactText: string
  whatsappNumber: string
  email: string
  instagram: string
  city: string
  projectImages: Array<{
    src: string
    alt: string
    title: string
    category: string
  }>
}

const draftFilePath = path.join('/', 'data', 'home.draft.json')
const publishedFilePath = path.join('/', 'data', 'home.published.json')

export const defaultHomeData: AdminHomeData = {
  hero: {
    title: 'Elegância feita sob medida',
    highlight: 'Móveis planejados',
    subtitle: 'Mobiliário planejado de alto padrão para ambientes exclusivos',
    buttonText: 'Solicitar projeto',
    buttonLink: '#contato',
    backgroundImage: '/images/hero.png'
  },
  about: {
    eyebrow: 'Sobre a Venatto',
    title: 'Design que transforma espaços',
    text: 'A Venatto desenvolve ambientes planejados de alto padrão, unindo design, funcionalidade e materiais nobres para criar espaços únicos. Cada projeto é pensado para refletir a personalidade e o estilo de vida de nossos clientes, transformando sonhos em realidade com excelência e sofisticação.'
  },
  cta: {
    title: 'Pronto para transformar seu espaço?',
    subtitle: 'Converse com a Venatto e inove seu ambiente com móveis planejados.',
    buttonText: 'Fale conosco',
    buttonLink: '#contato'
  },
  contact: {
    whatsapp: '',
    email: '',
    instagram: '',
    city: ''
  },
  branding: {
    primaryColor: '#1F3D2B',
    secondaryColor: '#F5F3EF',
    accentColor: '#C6A46C'
  }
}

const legacyKeys = ['title', 'subtitle', 'buttonText']

function isLegacyPayload(data: any): boolean {
  return (
    data && typeof data === 'object' && !('hero' in data) && legacyKeys.some(key => key in data)
  )
}

export function normalizeHomeData(data: any): AdminHomeData {
  if (!data || typeof data !== 'object') {
    return defaultHomeData
  }

  if (isLegacyPayload(data)) {
    return {
      ...defaultHomeData,
      hero: {
        ...defaultHomeData.hero,
        title: data.title || defaultHomeData.hero.title,
        subtitle: data.subtitle || defaultHomeData.hero.subtitle,
        buttonText: data.buttonText || defaultHomeData.hero.buttonText
      }
    }
  }

  return {
    hero: {
      ...defaultHomeData.hero,
      ...(data.hero ?? {}),
      title: data.hero?.title ?? data.title ?? defaultHomeData.hero.title,
      subtitle: data.hero?.subtitle ?? data.subtitle ?? defaultHomeData.hero.subtitle,
      buttonText: data.hero?.buttonText ?? data.buttonText ?? defaultHomeData.hero.buttonText,
      buttonLink: data.hero?.buttonLink ?? defaultHomeData.hero.buttonLink,
      highlight: data.hero?.highlight ?? defaultHomeData.hero.highlight,
      backgroundImage: data.hero?.backgroundImage ?? defaultHomeData.hero.backgroundImage
    },
    about: {
      ...defaultHomeData.about,
      ...(data.about ?? {})
    },
    cta: {
      ...defaultHomeData.cta,
      ...(data.cta ?? {})
    },
    contact: {
      ...defaultHomeData.contact,
      ...(data.contact ?? {})
    },
    branding: {
      ...defaultHomeData.branding,
      ...(data.branding ?? {})
    }
  }
}

async function ensureHomeFile(filePath: string) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultHomeData, null, 2), 'utf-8')
  }
}

export async function readHomeFile(): Promise<AdminHomeData> {
  return readHomeDraftFile()
}

export async function readHomeDraftFile(): Promise<AdminHomeData> {
  try {
    await ensureHomeFile(draftFilePath)
    const data = await fs.readFile(draftFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    const normalized = normalizeHomeData(parsed)

    if (isLegacyPayload(parsed) || JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      await fs.writeFile(draftFilePath, JSON.stringify(normalized, null, 2), 'utf-8')
    }

    return normalized
  } catch (error) {
    console.warn('Failed to load or normalize home draft content, using defaults:', error)
    return defaultHomeData
  }
}

export async function readHomePublishedFile(): Promise<AdminHomeData | null> {
  try {
    await fs.access(publishedFilePath)
    const data = await fs.readFile(publishedFilePath, 'utf-8')
    const parsed = JSON.parse(data)
    return normalizeHomeData(parsed)
  } catch (error) {
    // Published file doesn't exist yet
    return null
  }
}

export async function writeHomeFile(content: AdminHomeData) {
  return writeHomeDraftFile(content)
}

export async function writeHomeDraftFile(content: AdminHomeData) {
  await fs.mkdir(path.dirname(draftFilePath), { recursive: true })
  await fs.writeFile(draftFilePath, JSON.stringify(normalizeHomeData(content), null, 2), 'utf-8')
}

export async function writeHomePublishedFile(content: AdminHomeData) {
  await fs.mkdir(path.dirname(publishedFilePath), { recursive: true })
  await fs.writeFile(publishedFilePath, JSON.stringify(normalizeHomeData(content), null, 2), 'utf-8')
}

export async function publishHomeContent() {
  const draftContent = await readHomeDraftFile()
  await writeHomePublishedFile(draftContent)
}

export async function revertHomeContent() {
  const publishedContent = await readHomePublishedFile()
  if (publishedContent) {
    await writeHomeDraftFile(publishedContent)
  } else {
    // If no published version exists, reset to defaults
    await writeHomeDraftFile(defaultHomeData)
  }
}

export async function hasUnpublishedChanges(): Promise<boolean> {
  const draftContent = await readHomeDraftFile()
  const publishedContent = await readHomePublishedFile()

  if (!publishedContent) {
    // If no published version exists, there are changes to publish
    return true
  }

  return JSON.stringify(draftContent) !== JSON.stringify(publishedContent)
}

export async function getHomeContent(): Promise<HomeContent> {
  // Try to read published content first, fallback to draft
  let homeData = await readHomePublishedFile()
  if (!homeData) {
    homeData = await readHomeDraftFile()
  }

  return {
    heroTitle: homeData.hero.title,
    heroSubtitle: homeData.hero.subtitle,
    heroButtonText: homeData.hero.buttonText,
    heroButtonLink: homeData.hero.buttonLink,
    heroImageUrl: homeData.hero.backgroundImage,
    aboutText: homeData.about.text,
    differentialsText: `${homeData.branding.primaryColor}, ${homeData.branding.secondaryColor}, ${homeData.branding.accentColor}`,
    projectsText: 'Portfólio de projetos realizados',
    processText: 'Entendimento, Projeto 3D, Produção, Entrega',
    contactText: homeData.cta.subtitle,
    whatsappNumber: homeData.contact.whatsapp || '5511999999999',
    email: homeData.contact.email || 'contato@venatto.com.br',
    instagram: homeData.contact.instagram || 'venatto',
    city: homeData.contact.city || 'São Paulo, SP',
    projectImages: [
      {
        src: "/images/gallery-kitchen.png",
        alt: "Co gourmet com armários em verde escuro e bancada de mármore branco",
        title: "Co Gourmet",
        category: "Cozinhas",
      },
      {
        src: "/images/gallery-bedroom.png",
        alt: "Quarto master com closet planejado em nogueira",
        title: "Quarto Master",
        category: "Dormitórios",
      },
      {
        src: "/images/gallery-dining.png",
        alt: "Sala de jantar com mesa em madeira maciça e iluminação sofisticada",
        title: "Sala de Jantar",
        category: "Salas",
      },
      {
        src: "/images/gallery-bathroom.png",
        alt: "Banheiro premium com bancada em madeira escura e acabamentos em mármore",
        title: "Banheiro Premium",
        category: "Banheiros",
      },
      {
        src: "/images/gallery-closet.png",
        alt: "Closet planejado com iluminação LED e prateleiras em nogueira",
        title: "Closet Exclusivo",
        category: "Closets",
      },
      {
        src: "/images/gallery-office.png",
        alt: "Home office sofisticado com estante planejada e parede em verde escuro",
        title: "Home Office",
        category: "Escritórios",
      },
    ],
  }
}
