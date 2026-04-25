"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import {
  MessageCircle,
  Instagram,
  MapPin,
  Phone,
  ChevronDown,
  Sparkles,
  PenTool,
  Factory,
  Truck,
  Menu,
  X,
  ArrowUp,
} from "lucide-react";

/* ───────────── Dynamic Content ───────────── */
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

interface SiteSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
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

const defaultSiteSettings: SiteSettings = {
  primaryColor: "#1F3D2B",
  secondaryColor: "#F5F3EF",
  accentColor: "#C6A46C",
};

/* ───────────── Intersection Observer Hook ───────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────────── NAVIGATION ───────────── */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const links = [
    { label: "Sobre", id: "sobre" },
    { label: "Diferenciais", id: "diferenciais" },
    { label: "Projetos", id: "projetos" },
    { label: "Processo", id: "processo" },
    { label: "Contato", id: "contato" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "nav-blur bg-[#F5F3EF]/90 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="relative z-50"
          >
            <span
              className="text-2xl md:text-3xl font-light tracking-[0.35em] uppercase"
              style={{ fontFamily: "var(--font-cinzel)", color: "#1F3D2B" }}
            >
              Venatto
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-xs tracking-[0.2em] uppercase text-[#1F3D2B]/70 hover:text-[#C6A46C] transition-colors duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contato")}
              className="btn-venatto ml-4 px-6 py-2.5 border border-[#C6A46C] text-[#C6A46C] text-xs tracking-[0.2em] uppercase hover:bg-[#C6A46C] hover:text-[#F5F3EF] cursor-pointer"
            >
              Fale conosco
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative z-50 text-[#1F3D2B] cursor-pointer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F5F3EF] flex flex-col items-center justify-center gap-8"
          >
            {links.map((link, i) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => scrollTo(link.id)}
                className="text-lg tracking-[0.25em] uppercase text-[#1F3D2B] hover:text-[#C6A46C] transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => scrollTo("contato")}
              className="btn-venatto mt-4 px-8 py-3 bg-[#1F3D2B] text-[#F5F3EF] text-sm tracking-[0.2em] uppercase hover:bg-[#C6A46C] cursor-pointer"
            >
              Solicitar Projeto
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────────── HERO ───────────── */
function Hero({ content }: { content: HomeContent }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.heroImageUrl}
          alt="Ambiente sofisticado com móveis planejados VENATTO"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <div className="w-12 h-px bg-[#C6A46C] mx-auto mb-8" />
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight"
            style={{ fontFamily: "var(--font-cinzel)", color: "#1F3D2B" }}
          >
            {content.heroTitle.split(' ').slice(0, -2).join(' ')}
            <br />
            <span className="text-gradient-gold">{content.heroTitle.split(' ').slice(-2).join(' ')}</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm sm:text-base md:text-lg tracking-wide text-[#1F3D2B]/60 mb-10 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
        >
          {content.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <button
            onClick={() =>
              document
                .getElementById("contato")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-venatto px-10 py-4 bg-[#1F3D2B] text-[#F5F3EF] text-xs sm:text-sm tracking-[0.25em] uppercase hover:bg-[#C6A46C] cursor-pointer"
          >
            {content.heroButtonText}
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="text-[#C6A46C]/60" size={24} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── SOBRE ───────────── */
function Sobre({ content }: { content: HomeContent }) {
  return (
    <section id="sobre" className="py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <div className="text-center max-w-3xl mx-auto">
            <div className="gold-line mx-auto mb-8" />
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#C6A46C] mb-6"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
            >
              Sobre a marca
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-8"
              style={{ fontFamily: "var(--font-cinzel)", color: "#1F3D2B" }}
            >
              A arte de criar
              <br />
              ambientes únicos
            </h2>
            <p
              className="text-sm sm:text-base md:text-lg leading-relaxed text-[#1F3D2B]/65"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
            >
              {content.aboutText}
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ───────────── DIFERENCIAIS ───────────── */
const diferenciais = [
  {
    icon: Sparkles,
    title: "Projetos exclusivos",
    desc: "Cada ambiente é projetado sob medida, refletindo seu estilo e personalidade.",
  },
  {
    icon: PenTool,
    title: "Atendimento personalizado",
    desc: "Acompanhamento individualizado em cada etapa, do conceito à entrega final.",
  },
  {
    icon: Factory,
    title: "Materiais premium",
    desc: "Seleção criteriosa de madeiras nobres, acabamentos e ferragens de alta qualidade.",
  },
  {
    icon: Truck,
    title: "Execução impecável",
    desc: "Equipe especializada e processos rigorosos que garantem acabamento perfeito.",
  },
];

function Diferenciais() {
  return (
    <section
      id="diferenciais"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#1F3D2B]"
    >
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <div className="text-center mb-16 md:mb-20">
            <div className="gold-line mx-auto mb-8" />
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#C6A46C] mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
            >
              Por que a Venatto
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#F5F3EF]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Nossos diferenciais
            </h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {diferenciais.map((item, i) => (
            <RevealSection key={item.title} delay={i * 0.15}>
              <div className="text-center group">
                <div className="w-14 h-14 rounded-full border border-[#C6A46C]/30 flex items-center justify-center mx-auto mb-6 group-hover:border-[#C6A46C] group-hover:bg-[#C6A46C]/10 transition-all duration-500">
                  <item.icon
                    size={22}
                    className="text-[#C6A46C]"
                    strokeWidth={1}
                  />
                </div>
                <h3
                  className="text-base sm:text-lg font-light tracking-wide mb-3 text-[#F5F3EF]"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-xs sm:text-sm leading-relaxed text-[#F5F3EF]/50"
                  style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
                >
                  {item.desc}
                </p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── PROJETOS ───────────── */
const projetos = [
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
];

function Projetos() {
  return (
    <section id="projetos" className="py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <RevealSection>
          <div className="text-center mb-16 md:mb-20">
            <div className="gold-line mx-auto mb-8" />
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#C6A46C] mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
            >
              Portfólio
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)", color: "#1F3D2B" }}
            >
              Nossos projetos
            </h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {projetos.map((proj, i) => (
            <RevealSection key={proj.title} delay={i * 0.1}>
              <div className="gallery-item relative group cursor-pointer aspect-[4/3] bg-[#e8e5df]">
                <Image
                  src={proj.src}
                  alt={proj.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#1F3D2B]/0 group-hover:bg-[#1F3D2B]/50 transition-all duration-700 flex items-end justify-start p-6">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p
                      className="text-[10px] tracking-[0.3em] uppercase text-[#C6A46C] mb-1"
                      style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
                    >
                      {proj.category}
                    </p>
                    <h3
                      className="text-lg font-light tracking-wide text-[#F5F3EF]"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {proj.title}
                    </h3>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── PROCESSO ───────────── */
const processSteps = [
  {
    num: "01",
    title: "Entendimento",
    desc: "Conhecemos seu estilo, necessidades e sonhos para criar o projeto ideal.",
  },
  {
    num: "02",
    title: "Projeto 3D",
    desc: "Desenvolvemos um projeto tridimensional detalhado para visualização completa.",
  },
  {
    num: "03",
    title: "Produção",
    desc: "Fabricação artesanal com materiais nobres e acabamentos impecáveis.",
  },
  {
    num: "04",
    title: "Entrega",
    desc: "Instalação profissional e acompanhamento pós-entrega para sua total satisfação.",
  },
];

function Processo() {
  return (
    <section
      id="processo"
      className="py-24 md:py-36 px-6 md:px-12 bg-[#1F3D2B]"
    >
      <div className="max-w-6xl mx-auto">
        <RevealSection>
          <div className="text-center mb-16 md:mb-20">
            <div className="gold-line mx-auto mb-8" />
            <p
              className="text-xs tracking-[0.3em] uppercase text-[#C6A46C] mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
            >
              Como funciona
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-[#F5F3EF]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Nosso processo
            </h2>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {processSteps.map((step, i) => (
            <RevealSection key={step.num} delay={i * 0.15}>
              <div className="relative text-center group">
                {/* Number */}
                <div className="mb-6">
                  <span
                    className="text-4xl sm:text-5xl font-extralight text-[#C6A46C]/25 group-hover:text-[#C6A46C]/50 transition-colors duration-500"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Gold dot */}
                <div className="w-2 h-2 rounded-full bg-[#C6A46C] mx-auto mb-6" />

                <h3
                  className="text-base sm:text-lg font-light tracking-wide mb-3 text-[#F5F3EF]"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs sm:text-sm leading-relaxed text-[#F5F3EF]/45"
                  style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
                >
                  {step.desc}
                </p>

                {/* Connector line (desktop) */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-[52px] -right-[3%] w-[106%] h-px">
                    <div className="w-full h-full bg-gradient-to-r from-[#C6A46C]/30 to-transparent" />
                  </div>
                )}
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── EXPERIÊNCIA ───────────── */
function Experiencia() {
  return (
    <section className="relative py-32 md:py-44 px-6 md:px-12 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/gallery-bedroom.png"
          alt="Ambiente sofisticado com móveis planejados"
          fill
          className="object-cover"
          quality={85}
        />
        <div className="absolute inset-0 bg-[#1F3D2B]/75" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <RevealSection>
          <div className="gold-line mx-auto mb-8" />
          <p
            className="text-xs tracking-[0.3em] uppercase text-[#C6A46C] mb-6"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
          >
            A experiência Venatto
          </p>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-wide leading-snug mb-6 text-[#F5F3EF]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            &ldquo;Cada projeto Venatto é desenvolvido para refletir o estilo de
            vida de quem valoriza sofisticação e exclusividade.&rdquo;
          </h2>
          <div className="w-12 h-px bg-[#C6A46C] mx-auto mt-10" />
        </RevealSection>
      </div>
    </section>
  );
}

/* ───────────── CTA FINAL ───────────── */
function CtaFinal() {
  return (
    <section id="contato" className="py-24 md:py-36 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <RevealSection>
          <div className="gold-line mx-auto mb-8" />
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide mb-6"
            style={{ fontFamily: "var(--font-cinzel)", color: "#1F3D2B" }}
          >
            Transforme seu ambiente
            <br />
            <span className="text-gradient-gold">com a Venatto</span>
          </h2>
          <p
            className="text-sm sm:text-base text-[#1F3D2B]/55 mb-10 max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
          >
            Entre em contato e agende uma consulta exclusiva com nossos
            especialistas em design de interiores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511999999999?text=Olá! Gostaria de solicitar um projeto."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-venatto inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#1F3D2B] text-[#F5F3EF] text-xs sm:text-sm tracking-[0.25em] uppercase hover:bg-[#C6A46C] transition-colors"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              Fale conosco
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ───────────── FOOTER ───────────── */
function Footer() {
  return (
    <footer className="bg-[#1F3D2B] py-16 md:py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-14">
          {/* Logo & Description */}
          <div>
            <h3
              className="text-xl font-light tracking-[0.3em] uppercase text-[#F5F3EF] mb-4"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Venatto
            </h3>
            <p
              className="text-xs leading-relaxed text-[#F5F3EF]/40"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
            >
              Mobiliário planejado de alto padrão para ambientes exclusivos.
              Design, funcionalidade e materiais nobres em cada detalhe.
            </p>
          </div>

          {/* Contato */}
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase text-[#C6A46C] mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
            >
              Contato
            </p>
            <div className="space-y-3">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-[#F5F3EF]/50 hover:text-[#C6A46C] transition-colors"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
              >
                <Phone size={14} strokeWidth={1.5} />
                +55 (11) 99999-9999
              </a>
              <a
                href="mailto:contato@venatto.com.br"
                className="flex items-center gap-3 text-xs text-[#F5F3EF]/50 hover:text-[#C6A46C] transition-colors"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
              >
                <MessageCircle size={14} strokeWidth={1.5} />
                contato@venatto.com.br
              </a>
            </div>
          </div>

          {/* Social & Location */}
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase text-[#C6A46C] mb-4"
              style={{ fontFamily: "var(--font-montserrat)", fontWeight: 400 }}
            >
              Redes Sociais
            </p>
            <div className="space-y-3">
              <a
                href="https://instagram.com/venatto"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-[#F5F3EF]/50 hover:text-[#C6A46C] transition-colors"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
              >
                <Instagram size={14} strokeWidth={1.5} />
                @venatto
              </a>
              <div
                className="flex items-center gap-3 text-xs text-[#F5F3EF]/50"
                style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
              >
                <MapPin size={14} strokeWidth={1.5} />
                São Paulo, SP
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C6A46C]/20 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[10px] tracking-wider text-[#F5F3EF]/30 uppercase"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
          >
            © {new Date().getFullYear()} Venatto. Todos os direitos reservados.
          </p>
          <p
            className="text-[10px] tracking-wider text-[#F5F3EF]/20 uppercase"
            style={{ fontFamily: "var(--font-montserrat)", fontWeight: 300 }}
          >
            Mobiliário planejado de alto padrão
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ───────────── WHATSAPP FLOATING BUTTON ───────────── */
function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os projetos Venatto."
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-pulse fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1FAD54] transition-colors cursor-pointer"
          aria-label="Fale conosco pelo WhatsApp"
        >
          <MessageCircle size={26} className="text-white" fill="white" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ───────────── BACK TO TOP ───────────── */
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 w-10 h-10 bg-[#1F3D2B]/80 rounded-full flex items-center justify-center hover:bg-[#C6A46C] transition-colors cursor-pointer"
          aria-label="Voltar ao topo"
        >
          <ArrowUp size={16} className="text-[#F5F3EF]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ───────────── MAIN PAGE ───────────── */
export default function Home() {
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    // Fetch dynamic content
    Promise.all([
      fetch('/api/home').then(res => res.ok ? res.json() : defaultHomeContent),
      fetch('/api/admin/site-settings').then(res => res.ok ? res.json() : defaultSiteSettings),
    ]).then(([content, settings]) => {
      setHomeContent(content);
      setSiteSettings(settings);
    }).catch(() => {
      // Use defaults if fetch fails
    });
  }, []);

  // Apply dynamic colors
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', siteSettings.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', siteSettings.accentColor);
  }, [siteSettings]);

  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero content={homeContent} />
      <Sobre content={homeContent} />
      <Diferenciais content={homeContent} />
      <Projetos content={homeContent} />
      <Processo content={homeContent} />
      <Experiencia />
      <CtaFinal content={homeContent} />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </main>
  );
}
