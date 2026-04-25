'use client'

import { useState, useEffect } from 'react'

interface HomeContent {
  title: string
  subtitle: string
  buttonText: string
}

export default function AdminHomePage() {
  const [content, setContent] = useState<HomeContent>({
    title: '',
    subtitle: '',
    buttonText: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchHomeContent()
  }, [])

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/admin/home', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else {
        setError('Erro ao carregar conteúdo')
      }
    } catch (error) {
      setError('Erro de rede')
    } finally {
      setLoading(false)
    }
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
        body: JSON.stringify(content),
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Editar Página Inicial</h1>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Título</span>
              <input
                type="text"
                value={content.title}
                onChange={event => setContent(prev => ({ ...prev, title: event.target.value }))}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Subtítulo</span>
              <input
                type="text"
                value={content.subtitle}
                onChange={event => setContent(prev => ({ ...prev, subtitle: event.target.value }))}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Texto do Botão</span>
              <input
                type="text"
                value={content.buttonText}
                onChange={event => setContent(prev => ({ ...prev, buttonText: event.target.value }))}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}