'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type SectionKey = 'hero' | 'about' | 'cta' | 'contact' | 'branding'

interface AdminHomeData {
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

const defaultHomeData: AdminHomeData = {
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

const sections: { key: SectionKey; label: string; description: string }[] = [
  { key: 'hero', label: 'Hero', description: 'Título, destaque e botão principal' },
  { key: 'about', label: 'Sobre', description: 'Título e texto da seção sobre' },
  { key: 'cta', label: 'CTA', description: 'Chamada para ação final' },
  { key: 'contact', label: 'Contato', description: 'Informações de contato' },
  { key: 'branding', label: 'Branding', description: 'Cores do visual' }
]

export default function AdminHomePage() {
  const [content, setContent] = useState<AdminHomeData>(defaultHomeData)
  const [selectedSection, setSelectedSection] = useState<SectionKey>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchHomeContent()
  }, [])

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/admin/home', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setContent({ ...defaultHomeData, ...data })
      } else {
        setError('Erro ao carregar conteúdo')
      }
    } catch (error) {
      setError('Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (section: SectionKey, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(content)
      })

      if (response.ok) {
        setSuccess('Conteúdo salvo com sucesso!')
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao salvar')
      }
    } catch (error) {
      setError('Erro de rede')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-700">Carregando editor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin Visual</p>
            <h1 className="text-3xl font-semibold text-slate-900">Editor Visual da Home</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Edite cada seção da página inicial com preview ao vivo e salve seu conteúdo diretamente no servidor.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50">Voltar ao painel</Link>
            <Link href="/" target="_blank" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Visualizar site</Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[260px_minmax(1fr,_1.2fr)_420px]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Seções</h2>
            <div className="space-y-2">
              {sections.map(section => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setSelectedSection(section.key)}
                  className={`block w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${selectedSection === section.key ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>{section.label}</span>
                  <p className="mt-1 text-xs font-normal text-slate-500">{section.description}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{sections.find(item => item.key === selectedSection)?.label}</h2>
                <p className="text-sm text-slate-500">Edite os campos da seção selecionada.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-600">{saving ? 'Salvando...' : 'Pronto para editar'}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedSection === 'hero' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Título</label>
                    <input
                      value={content.hero.title}
                      onChange={event => updateField('hero', 'title', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Destaque</label>
                    <input
                      value={content.hero.highlight}
                      onChange={event => updateField('hero', 'highlight', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Subtítulo</label>
                    <textarea
                      value={content.hero.subtitle}
                      onChange={event => updateField('hero', 'subtitle', event.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Texto do botão</label>
                      <input
                        value={content.hero.buttonText}
                        onChange={event => updateField('hero', 'buttonText', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Link do botão</label>
                      <input
                        value={content.hero.buttonLink}
                        onChange={event => updateField('hero', 'buttonLink', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Imagem de fundo</label>
                    <input
                      value={content.hero.backgroundImage}
                      onChange={event => updateField('hero', 'backgroundImage', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              )}

              {selectedSection === 'about' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Eyebrow</label>
                    <input
                      value={content.about.eyebrow}
                      onChange={event => updateField('about', 'eyebrow', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Título</label>
                    <input
                      value={content.about.title}
                      onChange={event => updateField('about', 'title', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Texto</label>
                    <textarea
                      value={content.about.text}
                      onChange={event => updateField('about', 'text', event.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              )}

              {selectedSection === 'cta' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Título</label>
                    <input
                      value={content.cta.title}
                      onChange={event => updateField('cta', 'title', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Subtítulo</label>
                    <input
                      value={content.cta.subtitle}
                      onChange={event => updateField('cta', 'subtitle', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Texto do botão</label>
                      <input
                        value={content.cta.buttonText}
                        onChange={event => updateField('cta', 'buttonText', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Link do botão</label>
                      <input
                        value={content.cta.buttonLink}
                        onChange={event => updateField('cta', 'buttonLink', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedSection === 'contact' && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">WhatsApp</label>
                      <input
                        value={content.contact.whatsapp}
                        onChange={event => updateField('contact', 'whatsapp', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Email</label>
                      <input
                        value={content.contact.email}
                        onChange={event => updateField('contact', 'email', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Instagram</label>
                      <input
                        value={content.contact.instagram}
                        onChange={event => updateField('contact', 'instagram', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Cidade</label>
                      <input
                        value={content.contact.city}
                        onChange={event => updateField('contact', 'city', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedSection === 'branding' && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Cor primária</label>
                      <input
                        type="text"
                        value={content.branding.primaryColor}
                        onChange={event => updateField('branding', 'primaryColor', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">Cor secundária</label>
                      <input
                        type="text"
                        value={content.branding.secondaryColor}
                        onChange={event => updateField('branding', 'secondaryColor', event.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Cor de destaque</label>
                    <input
                      type="text"
                      value={content.branding.accentColor}
                      onChange={event => updateField('branding', 'accentColor', event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Preview ao vivo</h2>
                <p className="text-sm text-slate-500">Veja como ficará a home antes de publicar.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-600">Admin</span>
            </div>

            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-slate-200" style={{ backgroundColor: content.branding.secondaryColor }}>
                <div className="relative overflow-hidden px-6 py-10 text-center" style={{ backgroundColor: content.branding.primaryColor, color: '#fff' }}>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-200">{content.hero.highlight || 'Destaque'}</p>
                  <h3 className="mt-4 text-3xl font-semibold leading-tight">{content.hero.title}</h3>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-100">{content.hero.subtitle}</p>
                  <a
                    href={content.hero.buttonLink || '#'}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    {content.hero.buttonText}
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{content.about.eyebrow}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{content.about.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{content.about.text}</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5" style={{ borderColor: content.branding.accentColor }}>
                <h3 className="text-xl font-semibold" style={{ color: content.branding.primaryColor }}>{content.cta.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{content.cta.subtitle}</p>
                <a
                  href={content.cta.buttonLink || '#'}
                  className="mt-5 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: content.branding.accentColor }}
                >
                  {content.cta.buttonText}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}