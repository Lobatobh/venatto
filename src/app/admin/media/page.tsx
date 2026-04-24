'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Upload, Trash2, Copy } from 'lucide-react'
import Image from 'next/image'

interface MediaAsset {
  id: string
  filename: string
  url: string
  size: number
  mimeType: string
  uploadedAt: string
}

export default function AdminMedia() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      } else if (response.status === 401) {
        router.push('/admin/login')
      } else {
        setError('Failed to load assets')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const newAsset = await response.json()
        setAssets([newAsset, ...assets])
        setSuccess('File uploaded successfully!')
        e.target.value = '' // Reset input
      } else {
        const data = await response.json()
        setError(data.error || 'Upload failed')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAssets(assets.filter(asset => asset.id !== id))
        setSuccess('File deleted successfully!')
      } else {
        const data = await response.json()
        setError(data.error || 'Delete failed')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    setSuccess('URL copied to clipboard!')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
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
            <h1 className="ml-4 text-2xl font-bold text-gray-900">Media Library</h1>
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
              <CardTitle>Upload New File</CardTitle>
              <CardDescription>Supported formats: JPG, PNG, WebP (max 5MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild disabled={uploading}>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Card key={asset.id}>
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={asset.url}
                      alt={asset.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium truncate">{asset.filename}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(asset.uploadedAt).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(asset.url)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy URL
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {assets.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No files uploaded yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}