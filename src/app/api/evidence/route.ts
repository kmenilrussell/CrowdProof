import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { MediaType, EvidenceStatus } from '@prisma/client'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { createHash } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const isAnonymous = formData.get('isAnonymous') === 'true'
    const userId = formData.get('userId') as string

    if (!file || !title || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate file hash
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileHash = createHash('sha256').update(buffer).digest('hex')

    // Save file to public directory
    const filename = `${Date.now()}-${file.name}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)
    
    try {
      await writeFile(filepath, buffer)
    } catch (error) {
      console.error('File save error:', error)
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
    }

    // Extract metadata (simplified for demo)
    const metadata = {
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      hash: fileHash
    }

    // Determine media type
    let mediaType: MediaType
    if (file.type.startsWith('image/')) {
      mediaType = MediaType.IMAGE
    } else if (file.type.startsWith('video/')) {
      mediaType = MediaType.VIDEO
    } else if (file.type.startsWith('audio/')) {
      mediaType = MediaType.AUDIO
    } else {
      mediaType = MediaType.DOCUMENT
    }

    // Create evidence record
    const evidence = await db.evidence.create({
      data: {
        title,
        description,
        type: mediaType,
        fileUrl: `/uploads/${filename}`,
        fileHash,
        fileSize: file.size,
        metadata,
        status: EvidenceStatus.PENDING,
        isAnonymous,
        uploaderId: userId
      }
    })

    // Create audit log
    await db.auditLog.create({
      data: {
        userId,
        action: 'EVIDENCE_UPLOAD',
        entityType: 'Evidence',
        entityId: evidence.id,
        newValues: {
          title,
          type: mediaType,
          fileUrl: `/uploads/${filename}`,
          isAnonymous
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      evidence: {
        id: evidence.id,
        title: evidence.title,
        description: evidence.description,
        type: evidence.type,
        fileUrl: evidence.fileUrl,
        status: evidence.status,
        createdAt: evidence.createdAt
      }
    })
  } catch (error) {
    console.error('Evidence upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}