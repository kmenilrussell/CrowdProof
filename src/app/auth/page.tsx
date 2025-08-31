"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Facebook, Mail, Shield } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/facebook')
      const data = await response.json()
      
      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        console.error('Failed to get Facebook auth URL')
      }
    } catch (error) {
      console.error('Facebook login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name: email.split('@')[0] })
      })

      const data = await response.json()
      
      if (data.user) {
        // Store user in localStorage for demo purposes
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        console.error('Login failed:', data.error)
      }
    } catch (error) {
      console.error('Email login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to CrowdProof</h1>
          <p className="text-gray-600 mt-2">Sign in to start sharing verified evidence</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Continue with Facebook
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                <Mail className="w-4 h-4 mr-2" />
                Sign In with Email
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  )
}