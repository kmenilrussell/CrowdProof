import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const appId = process.env.FACEBOOK_APP_ID
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI
    
    if (!appId || !redirectUri) {
      return NextResponse.json({ error: 'Facebook OAuth not configured' }, { status: 500 })
    }

    const scope = 'email,public_profile'
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Facebook auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}