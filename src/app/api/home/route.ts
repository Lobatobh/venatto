import { NextResponse } from 'next/server'
import { getHomeContent } from '@/lib/home-content'

export async function GET() {
  try {
    const content = await getHomeContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching home content:', error)
    // Return default content if something goes wrong
    const defaultContent = {
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
    }
    return NextResponse.json(defaultContent)
  }
}