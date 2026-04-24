import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10) // Change this in production
  await prisma.adminUser.upsert({
    where: { email: 'admin@venatto.com.br' },
    update: {},
    create: {
      email: 'admin@venatto.com.br',
      password: hashedPassword,
    },
  })

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      primaryColor: '#1F3D2B',
      secondaryColor: '#F5F3EF',
      accentColor: '#C6A46C',
    },
  })

  // Create home content
  await prisma.homeContent.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      heroTitle: 'Elegância feita sob medida',
      heroSubtitle: 'Mobiliário planejado de alto padrão para ambientes exclusivos',
      heroButtonText: 'Solicitar projeto',
      heroButtonLink: '#contato',
      heroImageUrl: '/images/hero.png',
      aboutText: 'A Venatto desenvolve ambientes planejados de alto padrão, unindo design, funcionalidade e materiais nobres para criar espaços únicos. Cada projeto é pensado para refletir a personalidade e o estilo de vida de nossos clientes, transformando sonhos em realidade com excelência e sofisticação.',
      differentialsText: 'Projetos exclusivos, Atendimento personalizado, Materiais premium, Execução impecável',
      projectsText: 'Portfólio de projetos realizados',
      processText: 'Entendimento, Projeto 3D, Produção, Entrega',
      contactText: 'Transforme seu ambiente com a Venatto',
    },
  })

  // Create SEO settings
  await prisma.seoSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      title: 'VENATTO | Mobiliário Planejado de Alto Padrão',
      description: 'Elegância feita sob medida. Mobiliário planejado de alto padrão para ambientes exclusivos. Projetos exclusivos, atendimento personalizado e materiais premium.',
      keywords: 'VENATTO, móveis planejados, alto padrão, mobiliário premium, design de interiores, ambientes exclusivos, projetos sob medida, luxo',
      canonicalUrl: 'https://www.venatto.com.br',
    },
  })

  console.log('Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })