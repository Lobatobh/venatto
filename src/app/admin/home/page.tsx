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
    image: string
  }
  cta: {
    title: string
    subtitle: string
    buttonText: string
    buttonLink: string
    backgroundImage: string
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

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'file'
  name: string
  filename: string
  url: string
  mimeType: string
  size: number
  createdAt: string
}

interface MediaLibrary {
  items: MediaItem[]
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
    text: 'A Venatto desenvolve ambientes planejados de alto padrão, unindo design, funcionalidade e materiais nobres para criar espaços únicos. Cada projeto é pensado para refletir a personalidade e o estilo de vida de nossos clientes, transformando sonhos em realidade com excelência e sofisticação.',
    image: ''
  },
  cta: {
    title: 'Pronto para transformar seu espaço?',
    subtitle: 'Converse com a Venatto e inove seu ambiente com móveis planejados.',
    buttonText: 'Fale conosco',
    buttonLink: '#contato',
    backgroundImage: ''
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

const sections: { key: SectionKey; label: string; description: string; icon: string }[] = [
  { key: 'hero', label: 'Hero', description: 'Título, destaque e botão principal', icon: '⭐' },
  { key: 'about', label: 'Sobre', description: 'Título e texto da seção sobre', icon: '🏠' },
  { key: 'cta', label: 'CTA', description: 'Chamada para ação final', icon: '🚀' },
  { key: 'contact', label: 'Contato', description: 'Informações de contato', icon: '📞' },
  { key: 'branding', label: 'Branding', description: 'Cores do visual', icon: '🎨' }
]

export default function AdminHomePage() {
  const [content, setContent] = useState<AdminHomeData>(defaultHomeData)
  const [selectedSection, setSelectedSection] = useState<SectionKey>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const [mediaLibrary, setMediaLibrary] = useState<MediaLibrary>({ items: [] })
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [selectedField, setSelectedField] = useState<string>('')

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

  const fetchMediaLibrary = async () => {
    try {
      const response = await fetch('/api/admin/media', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setMediaLibrary(data)
      }
    } catch (error) {
      console.error('Erro ao carregar mídia')
    }
  }

  const openMediaModal = (field: string) => {
    setSelectedField(field)
    setShowMediaModal(true)
    fetchMediaLibrary()
  }

  const selectMedia = (url: string) => {
    updateField(selectedSection, selectedField, url)
    setShowMediaModal(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHomeContent()
  }, [])

  const updateField = (section: SectionKey, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setIsDirty(true)
    setSuccess('')
    setError('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
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
        setIsDirty(false)
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
    <main className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Editor Visual Venatto</p>
            <h1 className="text-2xl font-semibold text-slate-900">Construtor de Home Premium</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${saving ? 'bg-amber-100 text-amber-800' : isDirty ? 'bg-slate-100 text-slate-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {saving ? 'Salvando...' : isDirty ? 'Alterações pendentes' : 'Salvo'}
            </span>
            <Link href="/admin" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">Voltar</Link>
            <Link href="/" target="_blank" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Visualizar site</Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-6 py-6 lg:grid-cols-[280px_1fr_480px]">
        <aside className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Painel</h2>
              <p className="mt-2 text-sm text-slate-600">Selecione uma seção para editar.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600">Editor</span>
          </div>
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 lg:block lg:overflow-visible">
            {sections.map(section => (
              <button
                key={section.key}
                type="button"
                onClick={() => setSelectedSection(section.key)}
                className={`flex min-w-[180px] items-start gap-3 rounded-3xl border px-4 py-4 text-left transition ${selectedSection === section.key ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-white'}`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${selectedSection === section.key ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-800'}`}>
                  {section.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{section.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{section.description}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Seção {sections.find(item => item.key === selectedSection)?.label}</h2>
                <p className="text-sm text-slate-500">Ajuste os campos da seção selecionada com precisão.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600">{selectedSection}</span>
                {success && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{success}</span>}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {selectedSection === 'hero' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Hero</h3>
                  <p className="mt-2 text-sm text-slate-600">Configurações do banner principal da home.</p>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Título principal</label>
                    <input
                      value={content.hero.title}
                      onChange={event => updateField('hero', 'title', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <label className="text-sm font-medium text-slate-700">Destaque</label>
                      <input
                        value={content.hero.highlight}
                        onChange={event => updateField('hero', 'highlight', event.target.value)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <label className="text-sm font-medium text-slate-700">Imagem de fundo</label>
                      {content.hero.backgroundImage ? (
                        <div className="space-y-3">
                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            <img
                              src={content.hero.backgroundImage}
                              alt="Preview"
                              className="h-40 w-full object-cover"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openMediaModal('backgroundImage')}
                              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                              Alterar Imagem
                            </button>
                            <button
                              type="button"
                              onClick={() => updateField('hero', 'backgroundImage', '')}
                              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openMediaModal('backgroundImage')}
                          className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
                        >
                          + Selecionar Imagem
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Subtítulo</label>
                    <textarea
                      value={content.hero.subtitle}
                      onChange={event => updateField('hero', 'subtitle', event.target.value)}
                      rows={4}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <label className="text-sm font-medium text-slate-700">Texto do botão</label>
                      <input
                        value={content.hero.buttonText}
                        onChange={event => updateField('hero', 'buttonText', event.target.value)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                    <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <label className="text-sm font-medium text-slate-700">Link do botão</label>
                      <input
                        value={content.hero.buttonLink}
                        onChange={event => updateField('hero', 'buttonLink', event.target.value)}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'about' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Sobre</h3>
                  <p className="mt-2 text-sm text-slate-600">Configurações da seção institucional.</p>
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Eyebrow</label>
                  <input
                    value={content.about.eyebrow}
                    onChange={event => updateField('about', 'eyebrow', event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Título</label>
                  <input
                    value={content.about.title}
                    onChange={event => updateField('about', 'title', event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Texto</label>
                  <textarea
                    value={content.about.text}
                    onChange={event => updateField('about', 'text', event.target.value)}
                    rows={5}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Imagem</label>
                  {content.about.image ? (
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img
                          src={content.about.image}
                          alt="Preview"
                          className="h-40 w-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openMediaModal('image')}
                          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Alterar Imagem
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('about', 'image', '')}
                          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openMediaModal('image')}
                      className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
                    >
                      + Selecionar Imagem
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectedSection === 'cta' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">CTA</h3>
                  <p className="mt-2 text-sm text-slate-600">Configurações da chamada final.</p>
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Título</label>
                  <input
                    value={content.cta.title}
                    onChange={event => updateField('cta', 'title', event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Subtítulo</label>
                  <input
                    value={content.cta.subtitle}
                    onChange={event => updateField('cta', 'subtitle', event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Texto do botão</label>
                    <input
                      value={content.cta.buttonText}
                      onChange={event => updateField('cta', 'buttonText', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Link do botão</label>
                    <input
                      value={content.cta.buttonLink}
                      onChange={event => updateField('cta', 'buttonLink', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Imagem de fundo</label>
                  {content.cta.backgroundImage ? (
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img
                          src={content.cta.backgroundImage}
                          alt="Preview"
                          className="h-40 w-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openMediaModal('backgroundImage')}
                          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Alterar Imagem
                        </button>
                        <button
                          type="button"
                          onClick={() => updateField('cta', 'backgroundImage', '')}
                          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openMediaModal('backgroundImage')}
                      className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
                    >
                      + Selecionar Imagem
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectedSection === 'contact' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Contato</h3>
                  <p className="mt-2 text-sm text-slate-600">Defina os canais de contato exibidos na home.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">WhatsApp</label>
                    <input
                      value={content.contact.whatsapp}
                      onChange={event => updateField('contact', 'whatsapp', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input
                      value={content.contact.email}
                      onChange={event => updateField('contact', 'email', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Instagram</label>
                    <input
                      value={content.contact.instagram}
                      onChange={event => updateField('contact', 'instagram', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Cidade</label>
                    <input
                      value={content.contact.city}
                      onChange={event => updateField('contact', 'city', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedSection === 'branding' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Branding</h3>
                  <p className="mt-2 text-sm text-slate-600">Ajuste as cores principais do visual.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Cor primária</label>
                    <input
                      type="text"
                      value={content.branding.primaryColor}
                      onChange={event => updateField('branding', 'primaryColor', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                  <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="text-sm font-medium text-slate-700">Cor secundária</label>
                    <input
                      type="text"
                      value={content.branding.secondaryColor}
                      onChange={event => updateField('branding', 'secondaryColor', event.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
                <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="text-sm font-medium text-slate-700">Cor de destaque</label>
                  <input
                    type="text"
                    value={content.branding.accentColor}
                    onChange={event => updateField('branding', 'accentColor', event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
              {success && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}
            </div>
          </form>
        </section>

        <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Preview</p>
              <h2 className="text-xl font-semibold text-slate-900">Como ficará a página</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600">Visual real</span>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
            <div className="border-b border-slate-200 bg-white px-4 py-3">
              <div className="flex h-9 items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div className="ml-3 h-2.5 w-24 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="p-6" style={{ backgroundColor: content.branding.secondaryColor }}>
              <div className="rounded-[24px] p-6" style={{ backgroundColor: content.branding.primaryColor, color: '#fff' }}>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-200">{content.hero.highlight}</p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight">{content.hero.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100">{content.hero.subtitle}</p>
                <a
                  href={content.hero.buttonLink || '#'}
                  className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  {content.hero.buttonText}
                </a>
              </div>
              <div className="mt-6 rounded-[24px] bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{content.about.eyebrow}</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{content.about.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{content.about.text}</p>
              </div>
              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" style={{ borderColor: content.branding.accentColor }}>
                <h3 className="text-xl font-semibold" style={{ color: content.branding.primaryColor }}>{content.cta.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{content.cta.subtitle}</p>
                <a
                  href={content.cta.buttonLink || '#'}
                  className="mt-5 inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: content.branding.accentColor }}
                >
                  {content.cta.buttonText}
                </a>
              </div>
              <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Contato</p>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold">WhatsApp:</span> {content.contact.whatsapp || '—'}</p>
                  <p><span className="font-semibold">Email:</span> {content.contact.email || '—'}</p>
                  <p><span className="font-semibold">Instagram:</span> {content.contact.instagram || '—'}</p>
                  <p><span className="font-semibold">Cidade:</span> {content.contact.city || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Biblioteca de Mídia</h2>
                  <p className="mt-1 text-sm text-slate-600">Selecione uma imagem para usar neste campo</p>
                </div>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              {mediaLibrary.items.filter(item => item.type === 'image').length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {mediaLibrary.items.filter(item => item.type === 'image').map(item => (
                    <button
                      key={item.id}
                      onClick={() => selectMedia(item.url)}
                      className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-white p-3 transition-all hover:border-slate-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                      <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3 text-left">
                        <p className="text-sm font-medium text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {(item.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-slate-400 transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-6xl mb-4">🖼️</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma imagem encontrada</h3>
                  <p className="text-slate-600 mb-6 max-w-md">
                    Você ainda não fez upload de nenhuma imagem. Vá para a Biblioteca de Mídia para adicionar imagens.
                  </p>
                  <Link
                    href="/admin/media"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Ir para Biblioteca de Mídia
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
