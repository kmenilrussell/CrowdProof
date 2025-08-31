"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, Eye, Lock, Database, Activity, CheckCircle, AlertTriangle, Info, Share2 } from "lucide-react"

interface AuditLog {
  id: string
  action: string
  entityType: string
  createdAt: string
  ipAddress?: string
  userAgent?: string
}

export default function PrivacyPage() {
  const [user, setUser] = useState<any>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
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

    fetchAuditLogs()
  }, [router])

  const fetchAuditLogs = async () => {
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll use mock data
      setAuditLogs([
        {
          id: '1',
          action: 'USER_LOGIN',
          entityType: 'User',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '2',
          action: 'EVIDENCE_UPLOAD',
          entityType: 'Evidence',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: '3',
          action: 'VERIFICATION_SUBMIT',
          entityType: 'Verification',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      ])
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'USER_LOGIN': return <Eye className="w-4 h-4" />
      case 'EVIDENCE_UPLOAD': return <Database className="w-4 h-4" />
      case 'VERIFICATION_SUBMIT': return <CheckCircle className="w-4 h-4" />
      case 'EVIDENCE_SHARE': return <Share2 className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'USER_LOGIN': return 'text-blue-600'
      case 'EVIDENCE_UPLOAD': return 'text-green-600'
      case 'VERIFICATION_SUBMIT': return 'text-purple-600'
      case 'EVIDENCE_SHARE': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
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
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Privacy & Security</h1>
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Privacy & Data
            </h2>
            <p className="text-gray-600">
              Transparency and control over your personal information
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Data Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="settings">Privacy Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Data Collection Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    What We Collect
                  </CardTitle>
                  <CardDescription>
                    Transparency about the data we collect and why
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        Account Information
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Email address</li>
                        <li>• Name (optional)</li>
                        <li>• Profile picture (optional)</li>
                        <li>• Facebook ID (if connected)</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4 text-green-600" />
                        Evidence Metadata
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• File hash (SHA-256)</li>
                        <li>• Upload timestamp</li>
                        <li>• File size and type</li>
                        <li>• Location data (when available)</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-600" />
                        Activity Data
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Login timestamps</li>
                        <li>• IP addresses</li>
                        <li>• Browser information</li>
                        <li>• Actions performed</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-orange-600" />
                        Security Data
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Device information</li>
                        <li>• Session tokens</li>
                        <li>• Security events</li>
                        <li>• Audit logs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Usage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    How We Use Your Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Platform Functionality</h4>
                        <p className="text-sm text-gray-600">
                          To provide core services like evidence upload, verification, and sharing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Security & Integrity</h4>
                        <p className="text-sm text-gray-600">
                          To maintain platform security and prevent fraud through audit trails
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">User Experience</h4>
                        <p className="text-sm text-gray-600">
                          To improve our services and provide personalized features
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Legal Compliance</h4>
                        <p className="text-sm text-gray-600">
                          To comply with legal obligations and respond to lawful requests
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Protection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Protection Measures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600">Encryption</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 256-bit SSL/TLS encryption</li>
                        <li>• AES-256 encryption at rest</li>
                        <li>• Secure hash algorithms</li>
                        <li>• Encrypted database storage</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-600">Access Control</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Role-based permissions</li>
                        <li>• Multi-factor authentication</li>
                        <li>• Session management</li>
                        <li>• Audit trail logging</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-purple-600">Data Retention</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Minimal data collection</li>
                        <li>• Automatic data purging</li>
                        <li>• User-controlled deletion</li>
                        <li>• GDPR compliant</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-orange-600">Transparency</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Clear privacy policies</li>
                        <li>• User data access</li>
                        <li>• Activity monitoring</li>
                        <li>• Regular audits</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Your Activity Log
                  </CardTitle>
                  <CardDescription>
                    Complete audit trail of all your activities on CrowdProof
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p>Loading activity log...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={getActionColor(log.action)}>
                              {getActionIcon(log.action)}
                            </div>
                            <div>
                              <h4 className="font-medium">{log.action.replace(/_/g, ' ')}</h4>
                              <p className="text-sm text-gray-500">
                                {formatDate(log.createdAt)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {log.ipAddress} • {log.userAgent?.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{log.entityType}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your privacy preferences and data sharing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      Privacy settings are coming soon! You'll be able to control data collection, 
                      visibility preferences, and data export/deletion options.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">Control who can see your profile information</p>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Activity Status</h4>
                        <p className="text-sm text-gray-600">Show your online status and activity</p>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Data Export</h4>
                        <p className="text-sm text-gray-600">Download all your data from CrowdProof</p>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Account Deletion</h4>
                        <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                      </div>
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}