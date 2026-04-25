'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

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

type FilterType = 'all' | 'image' | 'video' | 'file'

export default function AdminMediaPage() {
  const [library, setLibrary] = useState<MediaLibrary>({ items: [] })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchLibrary = async () => {
    try {
      const response = await fetch('/api/admin/media', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setLibrary(data)
      } else {
        setError('Erro ao carregar biblioteca')
      }
    } catch (error) {
      setError('Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLibrary()
  }, [])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (!response.ok) {
          const data = await response.json()
          setError(data.error || 'Erro ao fazer upload')
          break
        }
      }

      if (!error) {
        setSuccess('Upload concluído!')
        fetchLibrary()
      }
    } catch (error) {
      setError('Erro de rede')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return

    try {
      const response = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setSuccess('Item excluído!')
        fetchLibrary()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao excluir')
      }
    } catch (error) {
      setError('Erro de rede')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setSuccess('URL copiada!')
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const filteredItems = library.items.filter(item => {
    if (filter === 'all') return true
    return item.type === filter
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-slate-700">Carregando biblioteca...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-slate-50/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin Venatto</p>
            <h1 className="text-2xl font-semibold text-slate-900">Biblioteca de Mídia</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100">Voltar</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] gap-6 px-6 py-6">
        <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Upload de Mídia</h2>
              <p className="text-sm text-slate-500">Arraste arquivos ou clique para selecionar. Suportados: imagens (até 5MB), vídeos (até 50MB), PDFs (até 10MB).</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {uploading ? 'Enviando...' : 'Selecionar Arquivos'}
            </button>
          </div>
          {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          {success && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</p>}
        </div>

        <div className="mb-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Filtro:</span>
            {(['all', 'image', 'video', 'file'] as FilterType[]).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  filter === type
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'Todos' : type === 'image' ? 'Imagens' : type === 'video' ? 'Vídeos' : 'Arquivos'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map(item => (
            <div key={item.id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100 mb-4">
                {item.type === 'image' && (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                )}
                {item.type === 'video' && (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    controls
                  />
                )}
                {item.type === 'file' && (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl">📄</div>
                      <p className="mt-2 text-sm text-slate-600">PDF</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900 truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatSize(item.size)} • {formatDate(item.createdAt)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-800 transition hover:bg-slate-200"
                  >
                    Copiar URL
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-full bg-rose-100 px-3 py-2 text-xs font-medium text-rose-800 transition hover:bg-rose-200"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm text-center">
            <p className="text-slate-600">Nenhum item encontrado.</p>
          </div>
        )}
      </div>
    </main>
  )
}