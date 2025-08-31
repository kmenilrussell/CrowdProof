import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VerificationType, VerificationStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { evidenceId, verifierId, type, status, comment, confidence } = await request.json()

    if (!evidenceId || !verifierId || !type || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if verification already exists
    const existingVerification = await db.verification.findUnique({
      where: {
        evidenceId_verifierId: {
          evidenceId,
          verifierId
        }
      }
    })

    let verification

    if (existingVerification) {
      // Update existing verification
      verification = await db.verification.update({
        where: { id: existingVerification.id },
        data: {
          status,
          comment,
          confidence
        }
      })
    } else {
      // Create new verification
      verification = await db.verification.create({
        data: {
          evidenceId,
          verifierId,
          type,
          status,
          comment,
          confidence
        }
      })
    }

    // Update evidence status based on verifications
    const allVerifications = await db.verification.findMany({
      where: { evidenceId }
    })

    const approvedCount = allVerifications.filter(v => v.status === VerificationStatus.APPROVED).length
    const rejectedCount = allVerifications.filter(v => v.status === VerificationStatus.REJECTED).length
    const totalCount = allVerifications.length

    let newEvidenceStatus = verification.evidence.status // Keep current status as default

    if (totalCount >= 3) { // Need at least 3 verifications
      if (approvedCount >= totalCount * 0.7) { // 70% approval rate
        newEvidenceStatus = 'VERIFIED'
      } else if (rejectedCount >= totalCount * 0.7) { // 70% rejection rate
        newEvidenceStatus = 'REJECTED'
      } else if (rejectedCount >= totalCount * 0.3) { // 30% rejection rate
        newEvidenceStatus = 'FLAGGED'
      }
    }

    // Update evidence status if needed
    if (newEvidenceStatus !== verification.evidence.status) {
      await db.evidence.update({
        where: { id: evidenceId },
        data: { status: newEvidenceStatus }
      })
    }

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: verifierId,
        action: 'VERIFICATION_SUBMIT',
        entityType: 'Verification',
        entityId: verification.id,
        newValues: {
          evidenceId,
          type,
          status,
          comment,
          confidence
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      verification: {
        id: verification.id,
        evidenceId: verification.evidenceId,
        status: verification.status,
        type: verification.type,
        comment: verification.comment,
        confidence: verification.confidence,
        createdAt: verification.createdAt
      }
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}