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
}

const filePath = path.join('/', 'data', 'home.json')

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

async function ensureHomeFile() {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(defaultHomeData, null, 2), 'utf-8')
  }
}

export async function readHomeFile(): Promise<AdminHomeData> {
  try {
    await ensureHomeFile()
    const data = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(data)
    const normalized = normalizeHomeData(parsed)

    if (isLegacyPayload(parsed) || JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      await fs.writeFile(filePath, JSON.stringify(normalized, null, 2), 'utf-8')
    }

    return normalized
  } catch (error) {
    console.warn('Failed to load or normalize home content, using defaults:', error)
    return defaultHomeData
  }
}

export async function writeHomeFile(content: AdminHomeData) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(normalizeHomeData(content), null, 2), 'utf-8')
}

export async function getHomeContent(): Promise<HomeContent> {
  const homeData = await readHomeFile()
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
    contactText: homeData.cta.subtitle
  }
}
