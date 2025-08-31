"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Upload, Users, Share2, MapPin, Clock, CheckCircle, Eye } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Citizen Journalism Reinvented
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              CrowdProof
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Empowering everyday users to become verified citizen journalists—capturing geo-verified, 
              timestamped evidence and sharing it with confidence and integrity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3" asChild>
                <a href="/auth">Get Started</a>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CrowdProof?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides the tools and infrastructure needed for trustworthy citizen journalism
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Verified Evidence</CardTitle>
                <CardDescription>
                  Geo-verified, timestamped multimedia evidence with secure hash validation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Community Verification</CardTitle>
                <CardDescription>
                  Crowdsourced validation ensures credibility and authenticity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Seamless Sharing</CardTitle>
                <CardDescription>
                  Share verified content directly to Facebook and other platforms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Location Data</CardTitle>
                <CardDescription>
                  GPS coordinates and location metadata embedded in every submission
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Timestamped</CardTitle>
                <CardDescription>
                  Precise timestamps ensure temporal accuracy and evidence integrity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Privacy First</CardTitle>
                <CardDescription>
                  Transparent data handling with optional anonymous submissions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple three-step process to become a verified citizen journalist
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Capture Evidence</h3>
              <p className="text-gray-600">
                Upload photos, videos, or documents with automatic metadata extraction
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Verify</h3>
              <p className="text-gray-600">
                Your evidence is reviewed and verified by the community
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Share & Impact</h3>
              <p className="text-gray-600">
                Share verified content with trust badges to make a difference
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of citizen journalists who are already using CrowdProof to share verified stories
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
            <a href="/auth">Start Your Journey</a>
          </Button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Audit Trail</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Facebook Partner</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}