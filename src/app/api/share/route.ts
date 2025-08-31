import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SharePlatform, ShareStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { evidenceId, platform, userId } = await request.json()

    if (!evidenceId || !platform || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get evidence details
    const evidence = await db.evidence.findUnique({
      where: { id: evidenceId },
      include: {
        uploader: {
          select: {
            name: true,
            avatar: true
          }
        }
      }
    })

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
    }

    // Check if evidence is verified (only verified evidence can be shared)
    if (evidence.status !== 'VERIFIED') {
      return NextResponse.json({ error: 'Only verified evidence can be shared' }, { status: 400 })
    }

    // Create share record
    const share = await db.share.create({
      data: {
        evidenceId,
        platform,
        status: ShareStatus.PENDING
      }
    })

    let shareUrl = null
    let shareStatus = ShareStatus.PENDING

    // Simulate sharing based on platform
    if (platform === SharePlatform.FACEBOOK) {
      // In a real implementation, this would use Facebook Graph API
      shareUrl = `https://facebook.com/share?u=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')}/evidence/${evidenceId}`
      shareStatus = ShareStatus.SUCCESS
    } else if (platform === SharePlatform.TWITTER) {
      // In a real implementation, this would use Twitter API
      const text = `Verified Evidence: ${evidence.title} - CrowdProof`
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')}/evidence/${evidenceId}`
      shareStatus = ShareStatus.SUCCESS
    } else if (platform === SharePlatform.WHATSAPP) {
      const text = `Verified Evidence: ${evidence.title} - ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/evidence/${evidenceId}`
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
      shareStatus = ShareStatus.SUCCESS
    }

    // Update share record
    await db.share.update({
      where: { id: share.id },
      data: {
        shareUrl,
        status: shareStatus,
        sharedAt: shareStatus === ShareStatus.SUCCESS ? new Date() : null
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId,
        action: 'EVIDENCE_SHARE',
        entityType: 'Share',
        entityId: share.id,
        newValues: {
          evidenceId,
          platform,
          shareUrl,
          status: shareStatus
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      share: {
        id: share.id,
        evidenceId: share.evidenceId,
        platform: share.platform,
        shareUrl: share.shareUrl,
        status: share.status,
        sharedAt: share.sharedAt
      }
    })
  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}