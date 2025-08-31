import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { email, name, facebookId, avatar } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    let user = await db.user.findUnique({
      where: { email }
    })

    if (user) {
      // Update existing user with Facebook info if provided
      if (facebookId || avatar) {
        user = await db.user.update({
          where: { email },
          data: {
            ...(facebookId && { facebookId }),
            ...(avatar && { avatar })
          }
        })
      }
    } else {
      // Create new user
      user = await db.user.create({
        data: {
          email,
          name,
          facebookId,
          avatar,
          role: UserRole.UPLOADER
        }
      })
    }

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}