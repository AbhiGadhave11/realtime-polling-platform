import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWebSocketServer } from '@/lib/websocket'
import { z } from 'zod'

const createPollSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  options: z.array(z.string().min(1).max(100)).min(2).max(10),
})

export async function GET(request: NextRequest) {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: true,
        votes: true,
        likes: true,
        _count: {
          select: {
            votes: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate percentages for each option
    const pollsWithStats = polls.map((poll) => {
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

      return {
        ...poll,
        options: optionsWithStats,
        totalVotes: poll._count.votes,
        totalLikes: poll._count.likes,
      }
    })

    return NextResponse.json({ polls: pollsWithStats })
  } catch (error) {
    console.error('Error fetching polls:', error)
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, options } = createPollSchema.parse(body)

    // Create poll with options
    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        options: {
          create: options.map((text) => ({ text })),
        },
      },
      include: {
        options: true,
      },
    })

    // Broadcast new poll
    const wss = getWebSocketServer()
    if (wss) {
      const pollData = {
        ...poll,
        options: poll.options.map((opt) => ({ ...opt, votes: 0, percentage: 0 })),
        totalVotes: 0,
        totalLikes: 0,
        _count: { votes: 0, likes: 0 },
      }
      wss.broadcast({
        type: 'new_poll',
        pollId: poll.id,
        data: pollData,
      })
    }

    return NextResponse.json({
      poll: {
        ...poll,
        totalVotes: 0,
        totalLikes: 0,
        options: poll.options.map((opt) => ({ ...opt, votes: 0, percentage: 0 })),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating poll:', error)
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 })
  }
}

