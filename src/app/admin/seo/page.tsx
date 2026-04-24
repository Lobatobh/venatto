'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save } from 'lucide-react'

interface SeoSettings {
  title: string
  description: string
  keywords: string
  ogImageUrl?: string
  canonicalUrl: string
}

export default function AdminSEO() {
  const [settings, setSettings] = useState<SeoSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/seo-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else if (response.status === 401) {
        router.push('/admin/login')
      } else {
        setError('Failed to load SEO settings')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/seo-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSuccess('SEO settings saved successfully!')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to save')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof SeoSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value })
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!settings) {
    return <div className="min-h-screen flex items-center justify-center">SEO settings not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="ml-4 text-2xl font-bold text-gray-900">SEO Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Basic SEO</CardTitle>
              <CardDescription>Essential meta tags for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="VENATTO | Mobiliário Planejado de Alto Padrão"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Appears in search results and browser tabs (50-60 characters recommended)
                </p>
              </div>
              <div>
                <Label htmlFor="description">Meta Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  placeholder="Elegância feita sob medida..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Appears in search results (150-160 characters recommended)
                </p>
              </div>
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={settings.keywords}
                  onChange={(e) => updateField('keywords', e.target.value)}
                  placeholder="móveis planejados, alto padrão, mobiliário premium"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Comma-separated keywords (less important for modern SEO)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media & Open Graph</CardTitle>
              <CardDescription>How your site appears when shared on social platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ogImageUrl">Open Graph Image URL</Label>
                <Input
                  id="ogImageUrl"
                  value={settings.ogImageUrl || ''}
                  onChange={(e) => updateField('ogImageUrl', e.target.value)}
                  placeholder="/uploads/og-image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Image for social media sharing (1200x630px recommended)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical SEO</CardTitle>
              <CardDescription>Canonical URL and other technical settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={settings.canonicalUrl}
                  onChange={(e) => updateField('canonicalUrl', e.target.value)}
                  placeholder="https://www.venatto.com.br"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Preferred URL for this page (helps prevent duplicate content issues)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}