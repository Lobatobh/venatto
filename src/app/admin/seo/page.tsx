'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SeoData {
  title: string
  description: string
  keywords: string
  ogImage: string
  canonical: string
}

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'file'
  name: string
  filename: string
  url: string
  mimeType: string
  size: number
}

interface MediaLibrary {
  items: MediaItem[]
}

const defaultSeoData: SeoData = {
  title: 'VENATTO | Mobiliário Planejado de Alto Padrão',
  description: 'Elegância feita sob medida para ambientes exclusivos.',
  keywords: 'móveis planejados, marcenaria, interiores, Venatto',
  ogImage: '',
  canonical: 'https://venatto.com.br'
}

export default function AdminSeoPage() {
  const [content, setContent] = useState<SeoData>(defaultSeoData)
  const [selectedSection, setSelectedSection] = useState<string>('basic')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDirty, setIsDirty] = useState(false)

  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [reverting, setReverting] = useState(false)

  const [mediaLibrary, setMediaLibrary] = useState<MediaLibrary>({ items: [] })
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [selectedField, setSelectedField] = useState<string>('')

  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadedItem, setUploadedItem] = useState<MediaItem | null>(null)

  const sections = [
    { key: 'basic', label: 'Informações Básicas', description: 'Título, descrição e palavras-chave', icon: '📝' },
    { key: 'social', label: 'Redes Sociais', description: 'Open Graph e compartilhamento', icon: '📱' },
    { key: 'technical', label: 'Técnico', description: 'Canonical e configurações avançadas', icon: '⚙️' }
  ]

  const fetchSeoContent = async () => {
    try {
      const response = await fetch('/api/admin/seo', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setContent({ ...defaultSeoData, ...data.content })
        setHasUnpublishedChanges(data.hasUnpublishedChanges)
      } else {
        setError('Erro ao carregar SEO')
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
    setUploading(false)
    setUploadError('')
    setUploadedItem(null)
    fetchMediaLibrary()
  }

  const selectMedia = (url: string) => {
    updateField(selectedField, url)
    setShowMediaModal(false)
  }

  const uploadFile = async (file: File) => {
    // Validação
    if (!file.type.startsWith('image/')) {
      setUploadError('Apenas imagens são permitidas')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Imagem deve ter no máximo 5MB')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadedItem(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedItem(data.item)

        // Atualizar lista de mídias
        await fetchMediaLibrary()

        // Selecionar automaticamente a imagem enviada
        updateField(selectedField, data.item.url)
        setShowMediaModal(false)
      } else {
        const data = await response.json()
        setUploadError(data.error || 'Erro ao fazer upload')
      }
    } catch (error) {
      setUploadError('Erro de rede')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSeoContent()
  }, [])

  const updateField = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
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
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(content)
      })

      if (response.ok) {
        setSuccess('SEO salvo no rascunho!')
        setIsDirty(false)
        setHasUnpublishedChanges(true)
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

  const handlePublish = async () => {
    setPublishing(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'publish' })
      })

      if (response.ok) {
        setSuccess('SEO publicado com sucesso!')
        setHasUnpublishedChanges(false)
        setIsDirty(false)
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao publicar')
      }
    } catch (error) {
      setError('Erro de rede')
    } finally {
      setPublishing(false)
    }
  }

  const handleRevert = async () => {
    if (!confirm('Tem certeza que deseja reverter todas as alterações SEO não publicadas? Esta ação não pode ser desfeita.')) {
      return
    }

    setReverting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'revert' })
      })

      if (response.ok) {
        setSuccess('SEO revertido com sucesso!')
        setHasUnpublishedChanges(false)
        setIsDirty(false)
        // Recarregar conteúdo
        await fetchSeoContent()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao reverter')
      }
    } catch (error) {
      setError('Erro de rede')
    } finally {
      setReverting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-700">Carregando editor SEO...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Editor SEO Venatto</p>
            <h1 className="text-2xl font-semibold text-slate-900">Otimização da Home</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              saving ? 'bg-amber-100 text-amber-800' :
              publishing ? 'bg-blue-100 text-blue-800' :
              reverting ? 'bg-orange-100 text-orange-800' :
              hasUnpublishedChanges ? 'bg-yellow-100 text-yellow-800' :
              'bg-emerald-100 text-emerald-800'
            }`}>
              {saving ? 'Salvando...' :
               publishing ? 'Publicando...' :
               reverting ? 'Revertendo...' :
               hasUnpublishedChanges ? 'Alterações não publicadas' :
               'Publicado'}
            </span>
            {hasUnpublishedChanges && (
              <>
                <button
                  onClick={handleRevert}
                  disabled={reverting}
                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                >
                  Reverter alterações
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  Publicar SEO
                </button>
              </>
            )}
            <Link href="/admin" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">Voltar</Link>
            <Link href="/" target="_blank" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Visualizar site</Link>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              Salvar rascunho
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-6 py-6 lg:grid-cols-[280px_1fr_400px]">
        <aside className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Painel</h2>
              <p className="mt-2 text-sm text-slate-600">Selecione uma seção para editar.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600">SEO</span>
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

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            {success && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedSection === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Título da Página</label>
                    <input
                      type="text"
                      value={content.title}
                      onChange={event => updateField('title', event.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-slate-300 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                      placeholder="VENATTO | Mobiliário Planejado de Alto Padrão"
                    />
                    <p className="mt-2 text-xs text-slate-500">Recomendado: 50-60 caracteres</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Descrição</label>
                    <textarea
                      value={content.description}
                      onChange={event => updateField('description', event.target.value)}
                      rows={3}
                      className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-slate-300 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                      placeholder="Elegância feita sob medida para ambientes exclusivos."
                    />
                    <p className="mt-2 text-xs text-slate-500">Recomendado: 150-160 caracteres</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">Palavras-chave</label>
                    <input
                      type="text"
                      value={content.keywords}
                      onChange={event => updateField('keywords', event.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-slate-300 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                      placeholder="móveis planejados, marcenaria, interiores, Venatto"
                    />
                    <p className="mt-2 text-xs text-slate-500">Separe por vírgulas</p>
                  </div>
                </div>
              )}

              {selectedSection === 'social' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Imagem Open Graph</label>
                    <div className="mt-2">
                      {content.ogImage ? (
                        <div className="relative inline-block">
                          <img
                            src={content.ogImage}
                            alt="Open Graph"
                            className="h-32 w-32 rounded-xl border border-slate-200 object-cover"
                          />
                          <div className="absolute -top-2 -right-2 flex gap-1">
                            <button
                              type="button"
                              onClick={() => openMediaModal('ogImage')}
                              className="rounded-full bg-slate-900 p-1.5 text-white transition hover:bg-slate-800"
                              title="Alterar imagem"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => updateField('ogImage', '')}
                              className="rounded-full bg-red-600 p-1.5 text-white transition hover:bg-red-700"
                              title="Remover imagem"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openMediaModal('ogImage')}
                          className="flex h-32 w-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-slate-400 hover:bg-slate-100"
                        >
                          <div className="text-center">
                            <div className="text-2xl">📷</div>
                            <p className="mt-1 text-xs">Selecionar imagem</p>
                          </div>
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Recomendado: 1200x630px (PNG/JPG)</p>
                  </div>
                </div>
              )}

              {selectedSection === 'technical' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-slate-700">URL Canônica</label>
                    <input
                      type="url"
                      value={content.canonical}
                      onChange={event => updateField('canonical', event.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition hover:border-slate-300 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                      placeholder="https://venatto.com.br"
                    />
                    <p className="mt-2 text-xs text-slate-500">URL principal da página</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Preview</p>
              <h2 className="text-xl font-semibold text-slate-900">Como aparecerá</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-600">SEO</span>
          </div>

          {/* Google Preview */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Google Search</h3>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                <div className="h-3 flex-1 rounded-full bg-slate-200"></div>
              </div>
              <div className="mt-3">
                <h4 className="text-blue-600 text-sm hover:underline cursor-pointer line-clamp-1">
                  {content.title || 'VENATTO | Mobiliário Planejado de Alto Padrão'}
                </h4>
                <p className="text-green-700 text-xs mt-1">{content.canonical || 'https://venatto.com.br'}</p>
                <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                  {content.description || 'Elegância feita sob medida para ambientes exclusivos.'}
                </p>
              </div>
            </div>
          </div>

          {/* Social Preview */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Facebook / LinkedIn</h3>
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 text-white">
              <div className="flex items-start gap-3">
                {content.ogImage ? (
                  <img
                    src={content.ogImage}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-slate-700 flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm line-clamp-2">
                    {content.title || 'VENATTO | Mobiliário Planejado de Alto Padrão'}
                  </h4>
                  <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                    {content.description || 'Elegância feita sob medida para ambientes exclusivos.'}
                  </p>
                  <p className="text-slate-400 text-xs mt-2">{content.canonical || 'venatto.com.br'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Stats */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Estatísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Título:</span>
                <span className={`font-medium ${content.title.length > 60 ? 'text-red-600' : content.title.length > 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {content.title.length} chars
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Descrição:</span>
                <span className={`font-medium ${content.description.length > 160 ? 'text-red-600' : content.description.length > 150 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {content.description.length} chars
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Palavras-chave:</span>
                <span className="font-medium text-slate-900">
                  {content.keywords.split(',').length} termos
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Imagem OG:</span>
                <span className={`font-medium ${content.ogImage ? 'text-green-600' : 'text-red-600'}`}>
                  {content.ogImage ? 'Configurada' : 'Não configurada'}
                </span>
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
              {/* Upload Area */}
              <div className="mb-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="relative cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-slate-400 hover:bg-slate-100"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                      <p className="text-sm text-slate-600">Enviando imagem...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-4xl">📤</div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Arraste uma imagem ou clique para enviar</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF até 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                {uploadError && (
                  <p className="mt-3 text-sm text-red-600">{uploadError}</p>
                )}
              </div>

              {mediaLibrary.items.filter(item => item.type === 'image').length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {mediaLibrary.items.filter(item => item.type === 'image').map(item => (
                    <button
                      key={item.id}
                      onClick={() => selectMedia(item.url)}
                      className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-3 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${
                        uploadedItem?.id === item.id
                          ? 'border-emerald-400 ring-2 ring-emerald-200'
                          : 'border-transparent hover:border-slate-300'
                      }`}
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