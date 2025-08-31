import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const whereClause: any = {}
    
    if (userId) {
      whereClause.uploaderId = userId
    }
    
    if (status && status !== 'all') {
      whereClause.status = status
    }

    const evidence = await db.evidence.findMany({
      where: whereClause,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            verifications: true,
            shares: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to 50 items
    })

    return NextResponse.json({ evidence })
  } catch (error) {
    console.error('Evidence list error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}