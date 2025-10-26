import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: params.id },
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

    return NextResponse.json({
      poll: {
        ...poll,
        options: optionsWithStats,
        totalVotes: poll._count.votes,
        totalLikes: poll._count.likes,
      },
    })
  } catch (error) {
    console.error('Error fetching poll:', error)
    return NextResponse.json({ error: 'Failed to fetch poll' }, { status: 500 })
  }
}

