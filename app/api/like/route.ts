import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWebSocketServer } from '@/lib/websocket'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const likeSchema = z.object({
  pollId: z.string(),
  userId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pollId, userId } = likeSchema.parse(body)

    // Generate user ID if not provided (for client-side tracking only)
    const finalUserId = userId || nanoid()

    // Note: We don't check for existing likes on the server since userId will be null
    // Client handles duplicate prevention via localStorage
    
    // For anonymous users, we'll need a different approach
    // Check if any like exists for this poll (simplified for anonymous voting)
    const existingLike = await prisma.like.findFirst({
      where: {
        pollId,
        userId: finalUserId || undefined,
      },
    })

    if (existingLike && finalUserId) {
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      // Get updated poll stats
      const poll = await prisma.poll.findUnique({
        where: { id: pollId },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      })

      if (!poll) {
        return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
      }

      // Broadcast update via WebSocket
      const wss = getWebSocketServer()
      if (wss) {
        wss.broadcast({
          type: 'like',
          pollId,
          data: {
            totalLikes: poll._count.likes,
            liked: false,
          },
        })
      }

      return NextResponse.json({
        success: true,
        liked: false,
        totalLikes: poll._count.likes,
      })
    }

    // Create like without userId (anonymous liking)
    const like = await prisma.like.create({
      data: {
        pollId,
        userId: null, // Allow anonymous likes
      },
    })

    // Get updated poll stats
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Broadcast update via WebSocket
    const wss = getWebSocketServer()
    if (wss) {
      wss.broadcast({
        type: 'like',
        pollId,
        data: {
          totalLikes: poll._count.likes,
          liked: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      liked: true,
      totalLikes: poll._count.likes,
      like,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}

