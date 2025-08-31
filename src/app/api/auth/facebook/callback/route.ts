import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(new URL('/auth/error?message=' + encodeURIComponent(error), request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/auth/error?message=No code provided', request.url))
    }

    const appId = process.env.FACEBOOK_APP_ID
    const appSecret = process.env.FACEBOOK_APP_SECRET
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI

    if (!appId || !appSecret || !redirectUri) {
      return NextResponse.redirect(new URL('/auth/error?message=Facebook OAuth not configured', request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`,
      { method: 'GET' }
    )

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(new URL('/auth/error?message=' + encodeURIComponent(tokenData.error.message), request.url))
    }

    const accessToken = tokenData.access_token

    // Get user info from Facebook
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`,
      { method: 'GET' }
    )

    const userData = await userResponse.json()

    if (userData.error) {
      return NextResponse.redirect(new URL('/auth/error?message=' + encodeURIComponent(userData.error.message), request.url))
    }

    // Create or update user in our database
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        name: userData.name,
        facebookId: userData.id,
        avatar: userData.picture?.data?.url
      })
    })

    const authData = await authResponse.json()

    if (authData.error) {
      return NextResponse.redirect(new URL('/auth/error?message=' + encodeURIComponent(authData.error), request.url))
    }

    // Redirect to success page with user data
    return NextResponse.redirect(new URL(`/auth/success?userData=${encodeURIComponent(JSON.stringify(authData.user))}`, request.url))
  } catch (error) {
    console.error('Facebook callback error:', error)
    return NextResponse.redirect(new URL('/auth/error?message=Internal server error', request.url))
  }
}