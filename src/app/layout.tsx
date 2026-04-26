import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import { getSeoContent } from "@/lib/seo-content";
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

export async function generateMetadata() {
  try {
    console.log("SEO VERSION 2 - JSON MODE")
    const seo = await getSeoContent()

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      alternates: {
        canonical: seo.canonical,
      },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: seo.canonical,
        images: seo.ogImage ? [{ url: seo.ogImage }] : [],
        type: 'website',
        locale: 'pt_BR',
      },
    }
  } catch {
    return {
      title: 'VENATTO | Mobiliário Planejado de Alto Padrão',
      description: 'Elegância feita sob medida para ambientes exclusivos.',
    }
  }
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
