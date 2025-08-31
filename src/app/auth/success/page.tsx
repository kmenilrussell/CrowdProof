"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"

export default function AuthSuccessPage() {
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const userDataParam = urlParams.get('userData')
    
    if (userDataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(userDataParam))
        setUserData(parsedData)
        // Store user in localStorage for demo purposes
        localStorage.setItem('user', JSON.stringify(parsedData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleContinue = () => {
    router.push('/dashboard')
  }

  if (!userData) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to CrowdProof!</h1>
          <p className="text-gray-600 mt-2">You have successfully signed in</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Successful</CardTitle>
            <CardDescription>
              You are now ready to start sharing verified evidence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {userData.avatar && (
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{userData.name}</p>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                  <p className="text-xs text-blue-600">Role: {userData.role}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleContinue} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}