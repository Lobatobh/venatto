import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { db } from "@/lib/db";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Force dynamic rendering to prevent build-time database access
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Check if environment variables are available (runtime only)
  if (!process.env.DATABASE_URL || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
    return {
      title: "VENATTO | Mobiliário Planejado de Alto Padrão",
      description: "Especialistas em arquitetura e design de interiores",
      keywords: ["arquitetura", "design", "interiores"],
      authors: [{ name: "VENATTO" }],
      icons: {
        icon: "/favicon.ico",
      },
    };
  }

  try {
    const seoSettings = await db.seoSettings.findFirst();

    if (seoSettings) {
      return {
        title: seoSettings.title,
        description: seoSettings.description,
        keywords: seoSettings.keywords.split(',').map(k => k.trim()),
        authors: [{ name: "VENATTO" }],
        icons: {
          icon: "/favicon.ico",
        },
        openGraph: {
          title: seoSettings.title,
          description: seoSettings.description,
          type: "website",
          locale: "pt_BR",
          images: seoSettings.ogImageUrl ? [{ url: seoSettings.ogImageUrl }] : undefined,
        },
        alternates: {
          canonical: seoSettings.canonicalUrl,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
  }

  // Fallback to static metadata
  return {
    title: "VENATTO | Mobiliário Planejado de Alto Padrão",
    description:
      "Elegância feita sob medida. Mobiliário planejado de alto padrão para ambientes exclusivos. Projetos exclusivos, atendimento personalizado e materiais premium.",
    keywords: [
      "VENATTO",
      "móveis planejados",
      "alto padrão",
      "mobiliário premium",
      "design de interiores",
      "ambientes exclusivos",
      "projetos sob medida",
      "luxo",
    ],
    authors: [{ name: "VENATTO" }],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: "VENATTO | Mobiliário Planejado de Alto Padrão",
      description:
        "Elegância feita sob medida. Mobiliário planejado de alto padrão para ambientes exclusivos.",
      type: "website",
      locale: "pt_BR",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${montserrat.variable} antialiased`}
        style={{
          fontFamily: "var(--font-montserrat)",
          background: "#F5F3EF",
          color: "#1F3D2B",
        }}
      >
        {children}
      </body>
    </html>
  );
}
