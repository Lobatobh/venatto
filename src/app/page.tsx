import { getHomeContent } from '@/lib/home-content'
import HomeClient from './HomeClient'

/* ───────────── SERVER COMPONENT ───────────── */
export default async function Home() {
  // Load content on server-side
  let homeContent: import('@/lib/home-content').HomeContent;
  try {
    homeContent = await getHomeContent();
  } catch (error) {
    // Fallback to defaults if loading fails
    homeContent = {
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
      whatsappNumber: "5511999999999",
      email: "contato@venatto.com.br",
      instagram: "venatto",
      city: "São Paulo, SP",
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
    };
  }

  const siteSettings = {
    primaryColor: "#1F3D2B",
    secondaryColor: "#F5F3EF",
    accentColor: "#C6A46C",
  };

  return <HomeClient homeContent={homeContent} siteSettings={siteSettings} />;
}