"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function AuthErrorPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const message = urlParams.get('message')
    setErrorMessage(message || 'An unknown error occurred')
  }, [])

  const handleRetry = () => {
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Authentication Error</h1>
          <p className="text-gray-600 mt-2">Something went wrong during sign in</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In Failed</CardTitle>
            <CardDescription>
              We encountered an error while trying to sign you in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>

            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                Return to Home
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              If the problem persists, please contact support
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}