import fs from 'fs/promises'
import path from 'path'

interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroImageUrl: string;
  aboutText: string;
  differentialsText: string;
  projectsText: string;
  processText: string;
  contactText: string;
}

const defaultHomeContent: HomeContent = {
  heroTitle: "Elegância feita sob medida",
  heroSubtitle: "Mobiliário planejado de alto padrão para ambientes exclusivos",
  heroButtonText: "Solicitar projeto",
  heroButtonLink: "#contato",
  heroImageUrl: "/images/hero.png",
  aboutText: "A Venatto desenvolve ambientes planejados de alto padrão, unindo design, funcionalidade e materiais nobres para criar espaços únicos. Cada projeto é pensado para refletir a personalidade e o estilo de vida de nossos clientes, transformando sonhos em realidade com excelência e sofisticação.",
  differentialsText: "Projetos exclusivos, Atendimento personalizado, Materiais premium, Execução impecável",
  projectsText: "Portfólio de projetos realizados",
  processText: "Entendimento, Projeto 3D, Produção, Entrega",
  contactText: "Transforme seu ambiente com a Venatto",
};

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'home.json')
    const data = await fs.readFile(filePath, 'utf-8')
    const jsonContent = JSON.parse(data)

    // Map JSON fields to HomeContent interface
    return {
      ...defaultHomeContent,
      heroTitle: jsonContent.title || defaultHomeContent.heroTitle,
      heroSubtitle: jsonContent.subtitle || defaultHomeContent.heroSubtitle,
      heroButtonText: jsonContent.buttonText || defaultHomeContent.heroButtonText,
    }
  } catch (error) {
    console.warn('Failed to load home content from file, using defaults:', error)
    return defaultHomeContent
  }
}