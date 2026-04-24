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

interface HomeContent {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroButtonLink: string
  heroImageUrl: string
  aboutText: string
  differentialsText: string
  projectsText: string
  processText: string
  contactText: string
}

export default function AdminHome() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/home-content')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      } else if (response.status === 401) {
        router.push('/admin/login')
      } else {
        setError('Failed to load content')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/home-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setSuccess('Content saved successfully!')
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

  const updateField = (field: keyof HomeContent, value: string) => {
    if (content) {
      setContent({ ...content, [field]: value })
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!content) {
    return <div className="min-h-screen flex items-center justify-center">Content not found</div>
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
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Edit Home Content</h1>
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
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Title</Label>
                <Input
                  id="heroTitle"
                  value={content.heroTitle}
                  onChange={(e) => updateField('heroTitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heroSubtitle">Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  value={content.heroSubtitle}
                  onChange={(e) => updateField('heroSubtitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heroButtonText">Button Text</Label>
                <Input
                  id="heroButtonText"
                  value={content.heroButtonText}
                  onChange={(e) => updateField('heroButtonText', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heroButtonLink">Button Link</Label>
                <Input
                  id="heroButtonLink"
                  value={content.heroButtonLink}
                  onChange={(e) => updateField('heroButtonLink', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="heroImageUrl">Image URL</Label>
                <Input
                  id="heroImageUrl"
                  value={content.heroImageUrl}
                  onChange={(e) => updateField('heroImageUrl', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="aboutText">Text</Label>
                <Textarea
                  id="aboutText"
                  value={content.aboutText}
                  onChange={(e) => updateField('aboutText', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Differentials Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="differentialsText">Text</Label>
                <Textarea
                  id="differentialsText"
                  value={content.differentialsText}
                  onChange={(e) => updateField('differentialsText', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="projectsText">Text</Label>
                <Textarea
                  id="projectsText"
                  value={content.projectsText}
                  onChange={(e) => updateField('projectsText', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="processText">Text</Label>
                <Textarea
                  id="processText"
                  value={content.processText}
                  onChange={(e) => updateField('processText', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="contactText">Text</Label>
                <Textarea
                  id="contactText"
                  value={content.contactText}
                  onChange={(e) => updateField('contactText', e.target.value)}
                  rows={3}
                />
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