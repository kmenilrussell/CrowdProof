"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Users, Share2, Shield, LogOut, Activity, TrendingUp, Eye, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Evidence {
  id: string
  title: string
  description?: string
  type: string
  fileUrl: string
  status: string
  createdAt: string
  _count: {
    verifications: number
    shares: number
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [myEvidence, setMyEvidence] = useState<Evidence[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalUploads: 0,
    verifiedItems: 0,
    shares: 0,
    verifications: 0
  })
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

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's evidence
      const evidenceResponse = await fetch(`/api/evidence/list?userId=${user?.id}`)
      if (evidenceResponse.ok) {
        const evidenceData = await evidenceResponse.json()
        setMyEvidence(evidenceData.evidence)
        
        // Calculate stats
        const uploads = evidenceData.evidence.length
        const verified = evidenceData.evidence.filter((e: Evidence) => e.status === 'VERIFIED').length
        const totalShares = evidenceData.evidence.reduce((sum: number, e: Evidence) => sum + e._count.shares, 0)
        const totalVerifications = evidenceData.evidence.reduce((sum: number, e: Evidence) => sum + e._count.verifications, 0)
        
        setStats({
          totalUploads: uploads,
          verifiedItems: verified,
          shares: totalShares,
          verifications: totalVerifications
        })
      }

      // Fetch recent activity (this would be a separate API in production)
      setRecentActivity([
        { id: 1, type: 'upload', title: 'Uploaded new evidence', time: '2 hours ago', status: 'pending' },
        { id: 2, type: 'verification', title: 'Verified community evidence', time: '1 day ago', status: 'completed' },
        { id: 3, type: 'share', title: 'Shared verified evidence', time: '2 days ago', status: 'completed' }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED': return <CheckCircle className="w-4 h-4" />
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'FLAGGED': return <AlertTriangle className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">CrowdProof</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                localStorage.removeItem('user')
                router.push('/')
              }}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/privacy">Privacy</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            Ready to share some verified evidence with the world?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalUploads}</div>
                  <p className="text-sm text-gray-600">Total Uploads</p>
                </div>
                <Upload className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.verifiedItems}</div>
                  <p className="text-sm text-gray-600">Verified Items</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.shares}</div>
                  <p className="text-sm text-gray-600">Shares</p>
                </div>
                <Share2 className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.verifications}</div>
                  <p className="text-sm text-gray-600">Verifications</p>
                </div>
                <Users className="w-8 h-8 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Upload Evidence</CardTitle>
              <CardDescription>
                Share photos, videos, or documents with metadata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/upload">Start Uploading</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Verify Evidence</CardTitle>
              <CardDescription>
                Help validate content from the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href="/verify">Review Submissions</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Share Content</CardTitle>
              <CardDescription>
                Share verified evidence on social media
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <a href="/share">Share Now</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="my-evidence" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-evidence">My Evidence</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="my-evidence" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  My Evidence
                </CardTitle>
                <CardDescription>
                  Track the status of your uploaded evidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading your evidence...</p>
                  </div>
                ) : myEvidence.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't uploaded any evidence yet</p>
                    <Button asChild>
                      <a href="/upload">Upload Your First Evidence</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myEvidence.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl">{getTypeIcon(item.type)}</span>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status}</span>
                          </Badge>
                          <div className="text-sm text-gray-500">
                            {item._count.verifications} reviews • {item._count.shares} shares
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest contributions and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Track your impact and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Advanced analytics coming soon</p>
                  <p className="text-sm text-gray-400">
                    Track your verification accuracy, share engagement, and community impact
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}