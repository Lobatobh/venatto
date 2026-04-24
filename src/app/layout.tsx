import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
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

export const metadata: Metadata = {
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
