"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, MapPin, Clock, Shield, Eye, EyeOff, ArrowLeft, CheckCircle, Info } from "lucide-react"

export default function UploadPage() {
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useState(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/auth')
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file || !title || !user) {
      setError('Please fill in all required fields')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('isAnonymous', isAnonymous.toString())
      formData.append('userId', user.id)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/evidence', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '📷'
    if (file.type.startsWith('video/')) return '🎥'
    if (file.type.startsWith('audio/')) return '🎵'
    return '📄'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Upload Successful!</CardTitle>
            <CardDescription>
              Your evidence has been uploaded and is now pending verification
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Upload Evidence</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{user.role}</Badge>
              <span className="text-sm text-gray-600">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Share Your Evidence
            </h2>
            <p className="text-gray-600">
              Upload photos, videos, or documents with automatic metadata extraction
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Select File
                </CardTitle>
                <CardDescription>
                  Choose the evidence file you want to upload
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  {file ? (
                    <div className="space-y-4">
                      <div className="text-4xl">{getFileTypeIcon(file)}</div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      {preview && (
                        <div className="mt-4">
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full h-48 object-cover rounded-lg mx-auto"
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                          setPreview(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-500">
                          Images, videos, audio, documents (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Evidence Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Evidence Details
                </CardTitle>
                <CardDescription>
                  Provide information about your evidence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter a descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this evidence shows and why it's important"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  />
                  <Label htmlFor="anonymous" className="flex items-center gap-2">
                    {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    Upload anonymously
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Metadata Preview */}
            {file && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Metadata Preview
                  </CardTitle>
                  <CardDescription>
                    Information that will be captured with your evidence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Timestamp: {new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Location: Available (if enabled)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Hash: SHA-256</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Size: {formatFileSize(file.size)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Notice
                </CardTitle>
                <CardDescription>
                  We believe in transparency about the data we collect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>File Hash:</strong> We generate a SHA-256 hash of your file to ensure integrity 
                      and prevent duplicates. This cannot be reversed to access your original file.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Metadata:</strong> We collect file type, size, and upload timestamp. 
                      Location data is only collected if you enable it on your device.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Audit Trail:</strong> All uploads are logged for security and compliance. 
                      You can view your activity in the Privacy section.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Anonymity:</strong> You can choose to upload anonymously. Your identity 
                      will be protected unless required by law.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    By uploading, you consent to this data collection. You can review your privacy 
                    settings and export your data at any time in the Privacy section.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Button
              type="submit"
              className="w-full"
              disabled={!file || !title || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Evidence'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}