import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWebSocketServer } from '@/lib/websocket'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const voteSchema = z.object({
  pollId: z.string(),
  optionId: z.string(),
  userId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pollId, optionId, userId } = voteSchema.parse(body)

    // Generate user ID if not provided (for client-side tracking only)
    const finalUserId = userId || nanoid()

    // Since we allow anonymous voting (userId = null), we don't enforce 
    // one vote per user on the server. The client handles preventing duplicates
    // via localStorage. If you want to enforce this, you'd need to create
    // actual User records first.

    // Create vote without userId (anonymous voting)
    // We track votes by pollId + optionId, not by user
    const vote = await prisma.vote.create({
      data: {
        pollId,
        optionId,
        // Don't set userId to avoid foreign key constraint
        userId: null,
      },
      include: {
        option: true,
        poll: {
          include: {
            options: true,
          },
        },
      },
    })

    // Get updated poll stats
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: true,
        votes: true,
        _count: {
          select: {
            votes: true,
          },
        },
      },
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Calculate percentages
    const totalVotes = poll._count.votes
    const optionsWithStats = poll.options.map((option) => {
      const votesForOption = poll.votes.filter((v) => v.optionId === option.id).length
      const percentage = totalVotes > 0 ? (votesForOption / totalVotes) * 100 : 0
      return {
        ...option,
        votes: votesForOption,
        percentage: Math.round(percentage * 10) / 10,
      }
    })

    // Broadcast update via WebSocket
    const wss = getWebSocketServer()
    console.log('Broadcasting vote update for poll:', pollId, 'WSS instance:', !!wss)
    if (wss) {
      wss.broadcast({
        type: 'vote',
        pollId,
        data: {
          options: optionsWithStats,
          totalVotes,
        },
      })
      console.log('Vote broadcast sent, clients:', wss.getClientCount())
    } else {
      console.error('WebSocket server instance not found!')
    }

    return NextResponse.json({
      success: true,
      vote: {
        ...vote,
        userId: finalUserId,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating vote:', error)
    return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
  }
}

