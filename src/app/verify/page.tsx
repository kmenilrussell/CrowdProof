"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Flag, Eye, MessageSquare, ArrowLeft, Clock, MapPin, Shield } from "lucide-react"

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

export default function VerifyPage() {
  const [user, setUser] = useState<any>(null)
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [verificationComment, setVerificationComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/auth')
      return
    }

    fetchEvidence()
  }, [router])

  const fetchEvidence = async () => {
    try {
      const response = await fetch(`/api/evidence/list?status=${activeTab === 'all' ? '' : activeTab}`)
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

  useEffect(() => {
    if (user) {
      fetchEvidence()
    }
  }, [activeTab, user])

  const handleVerification = async (status: 'APPROVED' | 'REJECTED' | 'FLAGGED') => {
    if (!selectedEvidence || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evidenceId: selectedEvidence.id,
          verifierId: user.id,
          type: 'COMMUNITY',
          status,
          comment: verificationComment,
          confidence: status === 'APPROVED' ? 80 : status === 'REJECTED' ? 90 : 70
        })
      })

      if (response.ok) {
        setSelectedEvidence(null)
        setVerificationComment('')
        fetchEvidence()
      } else {
        console.error('Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'VERIFIED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'FLAGGED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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

  if (selectedEvidence) {
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
                <h1 className="text-xl font-bold text-gray-900">Verify Evidence</h1>
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
                      <Eye className="w-5 h-5" />
                      Evidence Preview
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

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{new Date(selectedEvidence.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-500" />
                          <span>{selectedEvidence._count.verifications} verifications</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Verification Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Your Verification
                    </CardTitle>
                    <CardDescription>
                      Review this evidence and provide your assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Comment (Optional)</label>
                      <Textarea
                        placeholder="Share your thoughts about this evidence..."
                        value={verificationComment}
                        onChange={(e) => setVerificationComment(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Your Decision</h4>
                      
                      <Button
                        onClick={() => handleVerification('APPROVED')}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Evidence
                      </Button>
                      
                      <Button
                        onClick={() => handleVerification('FLAGGED')}
                        disabled={isSubmitting}
                        variant="outline"
                        className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Flag for Review
                      </Button>
                      
                      <Button
                        onClick={() => handleVerification('REJECTED')}
                        disabled={isSubmitting}
                        variant="outline"
                        className="w-full border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Evidence
                      </Button>
                    </div>

                    {isSubmitting && (
                      <Alert>
                        <AlertDescription>
                          Submitting your verification...
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
              <h1 className="text-xl font-bold text-gray-900">Community Verification</h1>
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
            Review Evidence
          </h2>
          <p className="text-gray-600">
            Help verify community submissions and maintain platform integrity
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All Evidence</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading evidence...</p>
              </div>
            ) : evidence.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No evidence found in this category</p>
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
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
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
                          <span>{item._count.verifications} reviews</span>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedEvidence(item)}
                        >
                          Review Evidence
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}