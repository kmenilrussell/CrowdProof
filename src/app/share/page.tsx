"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Facebook, Twitter, MessageCircle, Share2, ExternalLink, ArrowLeft, CheckCircle, Copy } from "lucide-react"

interface Evidence {
  id: string
  title: string
  description?: string
  type: string
  fileUrl: string
  status: string
  createdAt: string
  uploader: {
    id: string
    name: string
    avatar?: string
  }
  _count: {
    verifications: number
    shares: number
  }
}

export default function SharePage() {
  const [user, setUser] = useState<any>(null)
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/auth')
      return
    }

    fetchVerifiedEvidence()
  }, [router])

  const fetchVerifiedEvidence = async () => {
    try {
      const response = await fetch('/api/evidence/list?status=VERIFIED')
      if (response.ok) {
        const data = await response.json()
        setEvidence(data.evidence)
      }
    } catch (error) {
      console.error('Error fetching evidence:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (platform: string) => {
    if (!selectedEvidence || !user) return

    setIsSharing(true)
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evidenceId: selectedEvidence.id,
          platform: platform.toUpperCase(),
          userId: user.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShareSuccess(true)
        
        // Open share URL in new window if available
        if (data.share.shareUrl) {
          window.open(data.share.shareUrl, '_blank')
        }
        
        setTimeout(() => {
          setShareSuccess(false)
          setSelectedEvidence(null)
          fetchVerifiedEvidence()
        }, 2000)
      } else {
        console.error('Share failed')
      }
    } catch (error) {
      console.error('Share error:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return '📷'
      case 'VIDEO': return '🎥'
      case 'AUDIO': return '🎵'
      case 'DOCUMENT': return '📄'
      default: return '📎'
    }
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

  if (shareSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Shared Successfully!</CardTitle>
            <CardDescription>
              Your verified evidence has been shared
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (selectedEvidence) {
    const evidenceUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/evidence/${selectedEvidence.id}`
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => setSelectedEvidence(null)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to List
                </Button>
                <h1 className="text-xl font-bold text-gray-900">Share Evidence</h1>
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
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Evidence Preview */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Evidence to Share
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedEvidence.type === 'IMAGE' ? (
                        <img
                          src={selectedEvidence.fileUrl}
                          alt={selectedEvidence.title}
                          className="w-full rounded-lg"
                        />
                      ) : (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                          <div className="text-4xl mb-4">{getTypeIcon(selectedEvidence.type)}</div>
                          <p className="text-gray-600">
                            {selectedEvidence.type} file - Preview not available
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold">{selectedEvidence.title}</h3>
                        {selectedEvidence.description && (
                          <p className="text-gray-600">{selectedEvidence.description}</p>
                        )}
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Verified Evidence</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Share Options */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Platform</CardTitle>
                    <CardDescription>
                      Share this verified evidence on your preferred platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button
                        onClick={() => handleShare('FACEBOOK')}
                        disabled={isSharing}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Facebook className="w-4 h-4 mr-2" />
                        Share on Facebook
                      </Button>
                      
                      <Button
                        onClick={() => handleShare('TWITTER')}
                        disabled={isSharing}
                        className="w-full bg-sky-500 hover:bg-sky-600"
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Share on Twitter
                      </Button>
                      
                      <Button
                        onClick={() => handleShare('WHATSAPP')}
                        disabled={isSharing}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Share on WhatsApp
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Or copy link</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={evidenceUrl}
                          readOnly
                          className="flex-1 px-3 py-2 border rounded-md text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(evidenceUrl)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {isSharing && (
                      <Alert>
                        <AlertDescription>
                          Sharing your evidence...
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
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
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Share Verified Evidence</h1>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Share Verified Content
          </h2>
          <p className="text-gray-600">
            Share community-verified evidence on social media platforms
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading verified evidence...</p>
          </div>
        ) : evidence.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No verified evidence available to share</p>
              <p className="text-sm text-gray-400 mt-2">
                Evidence needs to be verified by the community before it can be shared
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidence.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>by {item.uploader.name}</span>
                          <Badge className="bg-green-100 text-green-800">
                            VERIFIED
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {item.type === 'IMAGE' && (
                      <img
                        src={item.fileUrl}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>{item._count.shares} shares</span>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedEvidence(item)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Evidence
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}